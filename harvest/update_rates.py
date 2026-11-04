#!/usr/bin/env python3
"""Refresh the site's currency rates from ExchangeRate-API (free endpoint).

Fetches https://open.er-api.com/v6/latest/USD, recomputes every site rate
per 1 PKR, and patches build.py (RATES_DICT + RATES_UPDATED + the footer
"last checked" date). Run build.py afterwards to regenerate app.js and
rates.json. Used by .github/workflows/rates.yml; safe to run by hand.

Rates are mid-market conversions. PKR stays the primary, verified price;
every converted figure on the site is labelled an estimate.
"""
import json, re, sys, urllib.request
from datetime import datetime, timezone

ORDER = ["PKR", "INR", "BDT", "AED", "SAR", "QAR", "KWD", "OMR", "BHD", "USD", "GBP", "EUR",
         "TRY", "CNY", "JPY", "KRW", "RUB", "CAD", "AUD", "SGD", "MYR", "IDR", "THB", "PHP",
         "ZAR", "NGN", "KES", "EGP", "LKR", "NPR", "AFN", "ILS", "CHF", "VND", "MMK", "KHR",
         "UZS", "KZT", "TZS", "GHS", "MAD", "IQD", "JOD", "AZN", "GEL"]

def main():
    req = urllib.request.Request("https://open.er-api.com/v6/latest/USD",
                                 headers={"User-Agent": "checkspecs-rates-updater"})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode())
    if data.get("result") != "success":
        print("rate fetch failed:", data.get("result")); sys.exit(1)
    usd = data["rates"]
    pkr = usd["PKR"]
    rates = {c: (1 if c == "PKR" else round(usd[c] / pkr, 6)) for c in ORDER}
    updated = datetime.fromtimestamp(data["time_last_update_unix"], tz=timezone.utc)
    iso = updated.strftime("%Y-%m-%d")
    human = updated.strftime("%d %B %Y")

    path = "build.py"
    src = open(path, encoding="utf-8").read()
    new_dict = "RATES_DICT = " + json.dumps(rates)
    src, n1 = re.subn(r"RATES_DICT = \{[^}]*\}", new_dict, src, count=1)
    src, n2 = re.subn(r'RATES_UPDATED = "\d{4}-\d{2}-\d{2}"', f'RATES_UPDATED = "{iso}"', src, count=1)
    src, n3 = re.subn(r"last checked [^\(]*\(Rs 276\.7 = \$1\)",
                      f"last checked {human} (Rs 276.7 = $1)", src, count=1)
    if not (n1 and n2 and n3):
        print(f"PATCH INCOMPLETE: dict={n1} date={n2} footer={n3}"); sys.exit(1)
    open(path, "w", encoding="utf-8").write(src)
    print(f"rates updated: base PKR {pkr} per USD, date {iso}, {len(rates)} currencies")

if __name__ == "__main__":
    main()
