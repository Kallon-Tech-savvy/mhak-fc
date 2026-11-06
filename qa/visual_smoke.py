"""Optional offline browser QA for MHAK FC's public/ source.

Install with: python -m pip install playwright; python -m playwright install chromium
Run from repository: python qa/visual_smoke.py
Requires no running server and does not send enquiries or publish anything.
"""
from __future__ import annotations
import base64
import json
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1] / 'public'
WIDTHS = [(195, 844), (240, 844), (320, 720), (360, 740), (390, 844), (768, 1000), (1280, 800)]
PAGES = ['index.html', 'stories/why-mhak.html', 'stories/identity-in-progress.html', 'privacy.html']


def html_with_embedded_assets(path: str) -> str:
    html = (ROOT / path).read_text(encoding='utf-8')
    css = (ROOT / 'styles.css').read_text(encoding='utf-8')
    html = html.replace('<link rel="stylesheet" href="styles.css">', f'<style>{css}</style>')
    html = html.replace('<link rel="stylesheet" href="../styles.css">', f'<style>{css}</style>')
    html = html.replace('<script src="script.js" defer></script>', '')
    for asset in ['assets/mhak-mark-white.svg', 'assets/mhak-mark-black.svg', 'assets/share-preview.png']:
        mime = 'image/svg+xml' if asset.endswith('.svg') else 'image/png'
        data = f'data:{mime};base64,' + base64.b64encode((ROOT / asset).read_bytes()).decode('ascii')
        for relative in [asset, '../' + asset]:
            html = html.replace('"' + relative + '"', '"' + data + '"')
    return html


def run() -> None:
    if not ROOT.is_dir():
        raise SystemExit(f'Missing website source: {ROOT}')
    records = []
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path=shutil.which('chromium') or shutil.which('google-chrome') or None,
            args=['--no-sandbox']
        )
        for width, height in WIDTHS:
            page = browser.new_page(viewport={'width': width, 'height': height}, device_scale_factor=1)
            page.set_content(html_with_embedded_assets('index.html'), wait_until='domcontentloaded')
            page.add_script_tag(content=(ROOT / 'script.js').read_text(encoding='utf-8'))
            v = page.evaluate("""() => ({
              docWidth: document.documentElement.scrollWidth,
              viewportWidth: innerWidth,
              statusTop: Math.round(document.getElementById('status').getBoundingClientRect().top),
              formHidden: document.getElementById('enquiry-form').hidden,
              formDisabled: document.getElementById('enquiry-fields').disabled
            })""")
            assert v['docWidth'] <= width + 1, f'Homepage horizontal overflow at {width}px: {v}'
            assert v['formHidden'] and v['formDisabled'], 'Enquiry unexpectedly available'
            if width <= 390:
                assert v['statusTop'] < height, f'Status section absent from first viewport at {width}px'
            if width <= 700:
                page.locator('.menu-toggle').click()
                assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'true'
                page.keyboard.press('Escape')
                assert page.locator('.menu-toggle').get_attribute('aria-expanded') == 'false'
                assert page.evaluate('document.activeElement===document.querySelector(".menu-toggle")')
            page.locator('.status-details summary').focus()
            page.keyboard.press('Enter')
            assert page.locator('.status-details').get_attribute('open') is not None
            page.emulate_media(reduced_motion='reduce')
            assert page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto'
            records.append({'page': 'index.html', 'width': width, **v, 'menu_and_disclosure': 'pass'})
            page.close()
        for story in PAGES[1:]:
            for width in [195, 320, 390]:
                page = browser.new_page(viewport={'width': width, 'height': 844})
                page.set_content(html_with_embedded_assets(story), wait_until='domcontentloaded')
                doc_width = page.evaluate('document.documentElement.scrollWidth')
                assert doc_width <= width + 1, f'{story} horizontal overflow at {width}px: {doc_width}'
                records.append({'page': story, 'width': width, 'docWidth': doc_width})
                page.close()
        browser.close()
    print(json.dumps({'status': 'PASS', 'checks': len(records), 'results': records}, indent=2))


if __name__ == '__main__':
    run()
