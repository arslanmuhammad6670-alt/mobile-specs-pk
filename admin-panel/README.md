# Check Specs — Admin Panel (Prep)

Ye folder us admin panel ki tayyari hai jisse aap **khud** Check Specs website par models add, edit aur delete kar saken — Muse ke baghair bhi. Abhi ye sirf files ki surat mein tayyar hai, **live nahi hai**. Neeche sab tafseel hai.

---

## Kya tayyar hai (is folder mein)

| File | Kaam |
|---|---|
| `admin.html` | Asal admin panel — ek hi page. Phone par khulega. Isi se models add/edit/delete honge. |
| `rebuild.yml` | GitHub Actions ki file. Ye repo ke `.github/workflows/` folder mein jayegi (abhi wahan nahi hai). Iska kaam: jab bhi model data change ho, website khud dobara ban kar live ho jaye. |
| `README.md` | Yehi file — saari maloomat. |

Panel kya kya kar sakta hai:

- **Naya model add** — brand, name, price (Rs), category, year, tagline, highlights, specs ki rows, aur photo. Save karte hi GitHub par `verified/expand-manual.json` mein model chala jata hai aur photo `img/<slug>/main.jpg` par upload ho jati hai.
- **Purane models manage** — koi si bhi `expand-*.json` file choose karke uske models ki list dekho, kisi ko bhi **edit** karo (name, price, year, category, specs, photo badalna) ya **delete** karo.
- Token (neeche dekho) sirf aapke phone ke browser mein save hota hai. Ye file, ye token, kuch bhi GitHub par commit nahi hota.

---

## Kya abhi live NAHI hai — baqi steps

Panel abhi aap istemal **nahi** kar sakte. Ye steps baqi hain, aur ye Muse karega jab aap kahenge (aapko code editor nahi kholna):

1. **`rebuild.yml` install karna** — is file ko repo ke `.github/workflows/rebuild.yml` par rakhna hai. Iske baghair panel se save to ho jayega, lekin website khud update nahi hogi.
2. **`admin.html` ko kholne ka tareeqa tay karna** — do options hain:
   - Repo mein rakh kar site ke address par kholna: `checkspecs.work.gd/admin.html` — page sab ko dikh sakta hai, lekin token ke baghair ye kuch nahi kar sakta (token sirf aapke paas hoga).
   - Ya file aapke phone mein save karke wohin se kholna.
3. **Aapka GitHub token (PAT) banana** — ye ek kaam sirf aap kar sakte hain, kyunke GitHub account aapka hai. Steps bilkul neeche hain, 2 minute ka kaam hai.
4. **Pehla test** — ek test model add karke dekhenge ke site par live aata hai ya nahi. Sab theek ho to panel aapke hawale.

Ek farq note kar lein: abhi Muse site ko `deploy_contents.py` se update karta hai, jo har dafa GitHub Pages ko dobara enable bhi kar deta hai. Workflow ye nahi karta (Pages pehle se on hai, zaroorat nahi). Agar Pages kabhi band ho jaye to ek dafa Muse ko kehna hoga, woh deploy chala dega.

---

## Token (PAT) banane ke steps — phone se

Token ek lambi secret key hoti hai. Panel isi key se aapki taraf se GitHub par file save karta hai. **Token kisi ko na bhejen — WhatsApp par bhi nahi.** Ghalat haathon mein jaye to banda aapki website badal sakta hai.

1. Phone ke browser (Chrome) mein **github.com** kholen aur apne account se login karen (aap Google se login karte hain, password ki zaroorat nahi).
2. Upar right corner par apni **profile photo** par tap karen → **Settings** choose karen.
3. Settings page ko bilkul neeche scroll karen → left side par **Developer settings** par tap karen.
4. **Personal access tokens** → **Fine-grained tokens** → **Generate new token** button.
5. Ye details bharen:
   - **Token name:** `Check Specs Admin`
   - **Expiration:** 1 year choose karen (khatam ho to naya bana lena hoga, panel bata dega).
   - **Repository access:** **Only select repositories** choose karke sirf **mobile-specs-pk** select karen.
   - **Permissions** → **Repository permissions** → **Contents** ko **Read and write** karen. (Metadata khud hi add ho jata hai.)
6. Neeche **Generate token** par tap karen.
7. Token screen par dikhega — `github_pat_` se shuru hoga. **Copy** kar lein. Ye sirf **ek dafa** dikhta hai; page band ho gaya to dobara nahi milega (naya banana parega, koi masla nahi).
8. Admin panel kholen, pehle hisse (section 1) mein token paste karke **Save token** dabayen, phir **Test connection** — aapka GitHub username aa jaye to sab theek hai.

Token sirf usi phone/browser mein rehta hai jahan paste kiya. Browser ka data clear ho ya phone change ho to token dobara paste karna hoga.

---

## Panel kya manage karta hai — aur kya nahi

Website ke saare models ek jaga nahi hain. Asaan alfaaz mein:

**Panel se manage ho sakta hai (edit/delete/add):**

- `verified/expand-manual.json` — **aapki apni file.** Panel se naye models default yahin jate hain.
- Baqi saari `verified/expand-*.json` files (jaise `expand-mac.json`, `expand-r.json`...) — ye Muse ki pipeline ne banayi hain, lekin panel inhein bhi khol kar edit/delete kar sakta hai. **Ehtiyat:** jo model pipeline ne dala hai use badalte hue soch samajh kar badlen; kuch garbar ho to Muse ko bata dein, woh theek kar dega.

**Panel se manage NAHI hota (ye Muse/pipeline ke paas rahenge):**

- **Sab se purane ~65 models** jo `build.py` file ke andar code mein likhe hain (pehli list). Ye panel mein nazar nahi aayenge.
- `verified/batch-a.json` se `batch-d.json` — ye verified specs ki correction files hain. Inka format list wala nahi, dictionary wala hai, is liye panel inhein khol hi nahi sakta (ye jaan boojh kar rakha hai — ghalti se kharab na hon).
- `verified/comms.json` (Wi-Fi, Bluetooth jaisi extra specs), `verified/images.json` (har rang ki alag photos), `verified/status-*.json` (Continued/Discontinued wala nishan) — ye sab pipeline sambhalti hai.

Yani: **aapke hath mein manual file + saari expand files hain; purani bunyadi files Muse ke paas mehfooz hain.** Aap ghalti se bhi pura site kharab nahi kar sakte.

---

## Save karne par hota kya hai (poora flow)

1. Aap panel mein **Save** dabate hain.
2. Photo hai to pehle wo GitHub par `img/<model>/main.jpg` mein upload hoti hai.
3. Phir model ki file (JSON) GitHub par update hoti hai.
4. GitHub Actions (jab `rebuild.yml` install ho jayegi) khud `build.py` chala kar site dobara banata hai aur live kar deta hai — aam tor par **2–5 minute** lagte hain.

Agar save ke doran error aaye "file changed on GitHub" — matlab usi doran pipeline ne bhi file badal di thi. Ghabrayen nahi: **Load models** dobara dabayen aur phir save karen.

## Hadood (limitations) — pehle se pata ho

- Ek models file takreeban **1 MB** se choti honi chahiye panel ke liye (GitHub ki limit). Manual file mein sainkadon models aa sakte hain, saalon ki fikar nahi.
- Model ka **slug** (page ke address wala naam, jaise `samsung-galaxy-a56`) edit ke doran badla nahi ja sakta — address badalna ho to model delete karke dobara add karen.
- Model **delete** karne se uski photo file bhi GitHub se hat jati hai aur agle rebuild ke baad wo model site se ghayab ho jata hai. Wapas nahi aata — delete soch kar karen.
- Panel ko internet chahiye aur GitHub login token zinda hona chahiye. Token expire ho to naya bana kar paste kar dein.
