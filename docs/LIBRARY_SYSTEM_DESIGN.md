# طراحی سیستم کتابخانه (Library) — جابغا

این سند طراحی کامل سیستم کتابخانه را پوشش می‌دهد: نقش گیم‌پلی، دوره‌ها، درخت مهارت، پیش‌نیازها، یکپارچگی با شغل، الگوریتم مطالعه، اقتصاد، جریان UI و ساختار داده. طراحی با وضعیت فعلی بازی (کتابخانه به‌عنوان شیء اتاق، صفحه مهارت‌ها، `COURSE_CATALOG`، `skills`, `jobListings`) هماهنگ است.

---

## ۱. نقش گیم‌پلی کتابخانه

### هدف کلی
کتابخانه نقطهٔ ورود اصلی **رشد شخصی، یادگیری مهارت و پیشرفت بلندمدت** است. بازیکن با مطالعه و گذراندن دوره‌ها مهارت بالا می‌برد، دوره‌های پیشرفته را باز می‌کند و در نهایت شغل‌های بهتر و درآمد بالاتر را آنلاک می‌کند.

### سهم در سیستم بازی

| بعد | نقش کتابخانه |
|-----|----------------|
| **رشد شخصی** | هر session مطالعه → XP کلی + XP مهارت → حس پیشرفت و «ساختن آینده». |
| **یادگیری مهارت** | دوره‌ها به مهارت مشخص (مثلاً برنامه‌نویسی) XP می‌دهند؛ سطح مهارت با فرمول ثابت از XP مشتق می‌شود. |
| **باز کردن شغل‌های بهتر** | شغل‌ها به `minXp`، `requiredCourses` و `requirements: { skill, level }` وابسته‌اند؛ کتابخانه هر سه را پشتیبانی می‌کند. |
| **پیشرفت بلندمدت** | پیش‌نیاز دوره‌ها (دورهٔ قبلی + سطح مهارت) باعث مسیر واضح مبتدی → پیشرفته می‌شود. |

### تفاوت با «مطالعه» فعلی (اتاق)
- **اتاق (Library object فعلی)**: کتاب داستان / مهارت نرم / روانشناسی → فقط XP و خوشحالی؛ بدون دوره و بدون مهارت مشخص.
- **کتابخانه به‌عنوان سیستم**: ورود به **دوره‌ها** و **جلسات مطالعهٔ ساختاریافته** که به مهارت و شغل گره می‌خورند.

پیشنهاد: ضربه روی کتابخانه در اتاق بازیکن را به **صفحهٔ مهارت‌ها و دوره‌ها** (`/skills`) یا به یک **صفحهٔ اختصاصی کتابخانه** (`/library`) هدایت کنیم؛ در هر دو حالت همان منطق دوره/مهارت/شغل استفاده می‌شود.

---

## ۲. نحوهٔ کار دوره‌ها (Courses)

### ایدهٔ کلی
بازیکن در **یک دوره** ثبت‌نام می‌کند، هر روز حداکثر `sessionsPerDay` **جلسه مطالعه** انجام می‌دهد، و بعد از `totalDays` روز و تکمیل همهٔ sessionها دوره **تمام** می‌شود و پاداش (XP، تقویت مهارت) اعمال می‌گردد.

### مثال: مبانی برنامه‌نویسی (Programming Basics)

| ویژگی | مقدار |
|--------|--------|
| نام | مبانی برنامه‌نویسی |
| طول | ۱۰ جلسه (مثلاً ۵ روز × ۲ جلسه یا ۱۰ روز × ۱ جلسه) |
| هزینه | ۲٬۰۰۰٬۰۰۰ تومان |
| پاداش XP (کامل) | ۵۰ XP |
| تقویت مهارت | برنامه‌نویسی +۱۵۰ XP (یا توزیع روی جلسات) |

### جریان
1. **ثبت‌نام**: بررسی پول، پیش‌نیازها، یک دوره فعال هم‌زمان → کم کردن هزینه → `activeCourse` ست می‌شود.
2. **جلسه مطالعه**: هر جلسه → کم کردن انرژی، اضافه کردن XP بازیکن و XP مهارت مربوطه، پیشرفت `currentDay` / `sessionsCompletedToday`.
3. **اتمام دوره**: وقتی همهٔ جلسات انجام شد → دوره از `activeCourse` حذف، `completedCourses` به‌روز، پاداش نهایی (مثلاً XP اضافه، خوشحالی).

### حالت‌های دوره
- **در دسترس**: پیش‌نیازها برآورده شده، هنوز گذرانده نشده.
- **ثبت‌نام‌شده (فعال)**: `activeCourse !== null`.
- **گذرانده‌شده**: `courseId` داخل `completedCourses`.

---

## ۳. درخت مهارت (Skill Tree)

### مهارت‌های پیشنهادی (هماهنگ با دادهٔ فعلی)

| دسته | مهارت (key) | نام فارسی | حداکثر XP سطح (نمونه) |
|------|-------------|-----------|-------------------------|
| فنی | programming | برنامه‌نویسی | 1000 |
| فنی | marketing | بازاریابی | 500 |
| فنی | accounting | حسابداری | 200 |
| فنی | design | طراحی | 200 |
| نرم | negotiation | مذاکره | 1000 |
| نرم | time_management | مدیریت زمان | 1000 |
| نرم | communication | ارتباطات | 500 |
| نرم | leadership | رهبری | 200 |

(مقادیر دقیق از `mock.ts` / `skills` قابل برداشت است.)

### سطح و XP
- هر مهارت: `level` (عدد صحیح) و `xp` (XP داخل سطح فعلی).
- **تبدیل XP → سطح** (فرمول ساده و قابل گسترش):

```ts
// XP لازم برای رسیدن به سطح L از سطح ۰
function xpToReachLevel(L: number): number {
  if (L <= 0) return 0;
  return 100 * L * (L + 1) / 2;  // 100, 300, 600, 1000, ...
}
// سطح از روی XP کل مهارت
function levelFromTotalXp(totalXp: number): number {
  let level = 0;
  while (xpToReachLevel(level + 1) <= totalXp) level++;
  return level;
}
// XP داخل سطح فعلی (برای نوار پیشرفت)
function xpInCurrentLevel(totalXp: number): number {
  const L = levelFromTotalXp(totalXp);
  const base = xpToReachLevel(L);
  return totalXp - base;
}
function maxXpInCurrentLevel(totalXp: number): number {
  const L = levelFromTotalXp(totalXp);
  return xpToReachLevel(L + 1) - xpToReachLevel(L);
}
```

- ذخیره‌سازی: برای هر مهارت فقط **مجموع XP آن مهارت** را نگه می‌داریم؛ `level` و `xp`/`maxXp` از توابع بالا مشتق می‌شوند تا یک منبع حقیقت داشته باشیم.

### ارتباط دوره → مهارت
- هر دوره یک `skillBoost: { skill: string; xpGain: number }` دارد.
- دو حالت ساده:
  - **در انتهای دوره**: یک‌جا `xpGain` به XP آن مهارت اضافه شود.
  - **هر جلسه**: `xpGain / totalSessions` به XP مهارت اضافه شود (پیشنهاد: توزیع روی جلسات برای بازخورد فوری).

---

## ۴. سیستم پیش‌نیاز (Prerequisites)

### انواع پیش‌نیاز
1. **دوره**: «دوره X را گذرانده باش» → `completedCourses` شامل `courseId` باشد.
2. **سطح مهارت**: «مهارت Y حداقل سطح Z» → `getSkillLevel(skillKey) >= Z`.

### ساختار پیش‌نیاز برای یک دوره

```ts
interface CoursePrerequisite {
  type: "course" | "skill";
  courseId?: string;           // when type === "course"
  skillKey?: string;           // when type === "skill"
  skillLevel?: number;         // when type === "skill"
}

interface CourseDefinition {
  id: string;
  name: string;
  // ... existing fields ...
  prerequisites?: CoursePrerequisite[];
}
```

### الگوریتم اعتبارسنجی پیش‌نیاز

```ts
function arePrerequisitesMet(
  prerequisites: CoursePrerequisite[] | undefined,
  completedCourses: string[],
  getSkillLevel: (skillKey: string) => number
): { met: boolean; missing: string[] } {
  if (!prerequisites?.length) return { met: true, missing: [] };
  const missing: string[] = [];
  for (const p of prerequisites) {
    if (p.type === "course" && p.courseId) {
      if (!completedCourses.includes(p.courseId))
        missing.push(`دوره: ${p.courseId}`);
    } else if (p.type === "skill" && p.skillKey != null && p.skillLevel != null) {
      if (getSkillLevel(p.skillKey) < p.skillLevel)
        missing.push(`مهارت ${p.skillKey} سطح ${p.skillLevel}`);
    }
  }
  return { met: missing.length === 0, missing };
}
```

- استفاده در **ثبت‌نام**: اگر `met === false`، ثبت‌نام رد شود و `missing` در UI نشان داده شود.
- **نمایش در لیست دوره‌ها**: دوره‌های قفل‌شده با لیبل «نیاز به: …» و غیرفعال بودن دکمه ثبت‌نام.

### مثال
- **Advanced Programming** نیاز دارد:
  - دوره «Programming Basics» گذرانده شده باشد.
  - مهارت برنامه‌نویسی حداقل سطح ۳.
- در داده:
  - `prerequisites: [{ type: "course", courseId: "python_basics" }, { type: "skill", skillKey: "programming", skillLevel: 3 }]`.

---

## ۵. یکپارچگی با شغل (Job Integration)

### منطق فعلی (حفظ شود)
- هر سطح ارشدیت شغل: `minXp`, `requiredCourses`, `requirements: { skill: string; level: number }[]`.
- `isJobEligible(jobId, seniority)` با استفاده از `player.xp`, `completedCourses` و `skills` (سطح هر مهارت با نام فارسی/انگلیسی) محاسبه می‌شود.

### نقش مهارت
- **باز کردن شغل**: مثلاً «برنامه‌نویسی سطح ۲» → آنلاک جونیور دولوپر؛ «برنامه‌نویسی سطح ۵» → آنلاک سینیور (با بقیه شرط‌ها).
- مهارت‌ها فقط از طریق **دوره‌ها** و در آینده «کار در شغل مرتبط» یا «کتاب مهارتی در کتابخانه» بالا می‌روند؛ کتابخانه جایی است که بازیکن عمداً برای مهارت‌سازی می‌آید.

### نگاشت skill key به نام نمایشی
- در `jobListings` از نام فارسی (مثلاً «برنامه‌نویسی») استفاده شده؛ در دادهٔ دوره/مهارت می‌توانیم `skillKey` (مثلاً programming) داشته باشیم و در UI با یک نقشه به نام فارسی تبدیل کنیم تا با `requirements[].skill` سازگار بماند.

---

## ۶. الگوریتم مطالعه (Study Loop)

### حلقهٔ ساده
1. بازیکن روی «یک جلسه مطالعه» کلیک می‌کند.
2. بررسی: دوره فعال وجود دارد؟ انرژی کافی؟ سقف جلسات امروز پر نشده؟
3. کم کردن انرژی؛ اضافه کردن XP بازیکن و XP مهارت دوره؛ به‌روزرسانی پیشرفت دوره.
4. اگر آخرین جلسهٔ دوره بود → اتمام دوره، پاداش نهایی، پاک کردن `activeCourse`.

### فرمول‌های پیشنهادی

- **XP بازیکن هر جلسه** (هماهنگ با پیاده‌سازی فعلی):
  - `xpPerSession = round((courseXpReward / totalSessions) * learningSpeedMultiplier)`
  - `totalSessions = totalDays * sessionsPerDay`
  - `learningSpeedMultiplier` از آیتم‌های اتاق (مثلاً قفسه کتاب) می‌آید.

- **XP مهارت هر جلسه**:
  - `skillXpPerSession = course.skillBoost ? round(course.skillBoost.xpGain / totalSessions) : 0`
  - این مقدار به مهارت `skillBoost.skill` اضافه شود (با key یکسان با `skills.hard/soft`).

- **مدت زمان (برای نمایش/احساس)**:
  - `studyDurationMinutes = 25 + 5 * sessionsPerDay` (مثلاً ۳۰–۴۰ دقیقه در روز).
  - اختیاری: این مقدار در `advanceTime()` استفاده شود تا زمان درون بازی جلو برود.

- **هزینه انرژی**:
  - از تعریف دوره: `energyCostPerSession` (و در نسخه اسپانسری مقدار جدا).

---

## ۷. تأثیر اقتصادی یادگیری

### دو مکانیزم پیشنهادی (ساده و قابل گسترش)

1. **آنلاک شغل‌های با حقوق بالاتر**
   - اصلی‌ترین اثر: بدون دوره و سطح مهارت کافی، شغل‌های مید/سینیور باز نمی‌شوند؛ با کتابخانه بازیکن دوره می‌گذراند و مهارت بالا می‌برد تا واجد شرایط شود. حقوق از روی `seniorityLevels[].salary` تعیین می‌شود.

2. **ضریب درآمد بر اساس سطح مهارت (اختیاری)**
   - مثلاً برای شغل فعلی: `incomeMultiplier = 1 + (avgRelevantSkillLevel - 1) * 0.02` (۲٪ به ازای هر سطح بالاتر از ۱).
   - یا فقط «به ازای هر سطح مهارت مرتبط با شغل، +۳٪ حقوق».
   - برای سادگی اولیه می‌توان فقط به **آنلاک شغل‌ها** اکتفا کرد و این ضریب را در فاز بعد اضافه کرد.

---

## ۸. جریان UI (UX)

### ضربه روی کتابخانه در اتاق
- انتقال به `/skills` یا `/library` (در صورت داشتن صفحه جدا برای کتابخانه).

### محتوای صفحه (کتابخانه / مهارت‌ها و دوره‌ها)

بازیکن پس از ورود باید ببیند:

1. **دورهٔ فعال (در صورت وجود)**
   - نام دوره، پیشرفت (مثلاً روز ۳ از ۷، جلسات امروز ۱ از ۲).
   - دکمه «یک جلسه مطالعه» (با نمایش انرژی و احتمالاً زمان).
   - دکمه انصراف از دوره.

2. **کاتالوگ دوره‌ها**
   - فیلتر بر اساس حوزه (برنامه‌نویسی، بازاریابی، …).
   - هر کارت دوره: نام، هزینه، پیش‌نیازها، وضعیت (قفل / قابل ثبت‌نام / گذرانده‌شده).
   - با ضربه: جزئیات + دکمه ثبت‌نام (در صورت واجد شرایط).

3. **پیشرفت مهارت‌ها**
   - دو بخش: مهارت‌های فنی و نرم.
   - هر مهارت: نام، سطح، نوار XP داخل سطح.

### ترتیب پیشنهادی در صفحه
- بالا: دورهٔ فعال (اگر هست).
- بعد: تب/بخش «دوره‌ها» و «مهارت‌ها» (یا دو تب اصلی).

---

## ۹. ساختار داده (Data Structure)

### دوره (Course)

```ts
interface CoursePrerequisite {
  type: "course" | "skill";
  courseId?: string;
  skillKey?: string;
  skillLevel?: number;
}

interface CourseDefinition {
  id: string;
  name: string;
  emoji: string;
  field: string;
  fieldLabel: string;
  totalDays: number;
  sessionsPerDay: number;
  xpReward: number;
  cost: number;
  energyCostPerSession: number;
  skillBoost?: { skill: string; xpGain: number };
  prerequisites?: CoursePrerequisite[];
  sponsoredVariant?: SponsoredCourseVariant;
}
```

### مهارت (Skill)

```ts
interface SkillState {
  key: string;        // "programming" | "marketing" | ...
  name: string;       // "برنامه‌نویسی"
  emoji: string;
  totalXp: number;    // تنها منبع حقیقت؛ level از این مشتق می‌شود
  maxXp?: number;    // اختیاری؛ برای سقف نهایی درخت
}
// level و xp/maxXp برای نوار از levelFromTotalXp و xpInCurrentLevel
```

### پیش‌نیاز (خلاصه)
- همان `CoursePrerequisite[]` روی هر دوره.
- اعتبارسنجی با `completedCourses` و تابع `getSkillLevel(skillKey)` که از `SkillState.totalXp` سطح را برمی‌گرداند.

### حالت دورهٔ فعال (موجود در استور)

```ts
interface ActiveCourseState {
  courseId: string;
  isSponsored: boolean;
  currentDay: number;
  sessionsCompletedToday: number;
  startedOnDay: number;
}
```

### تغییرات پیشنهادی در استور
- **مهارت‌ها**: اگر اکنون به صورت `level` + `xp`/`maxXp` ذخیره می‌شوند، می‌توان به‌تدریج به `totalXp` مهاجرت کرد و level را مشتق گرفت؛ یا در همان ساختار فعلی، در `completeSession` علاوه بر `player.xp`، مقدار `skillBoost.xpGain` (یا سهم هر جلسه) به مهارت مربوط اضافه شود.
- **دوره‌ها**: اضافه کردن فیلد `prerequisites` به `COURSE_CATALOG` و فراخوانی `arePrerequisitesMet` در `enrollCourse`.

---

## ۱۰. سادگی و مقیاس‌پذیری

### ساده نگه داشتن
- یک دوره فعال هم‌زمان.
- پیش‌نیاز فقط «دوره» و «سطح مهارت»؛ بدون وابستگی به سطح بازیکن یا روز بازی (مگر در طراحی بعدی).
- فرمول سطح مهارت خطی (مثلاً 100 * L * (L+1) / 2).
- بدون مینی‌گیم یا زمان واقعی؛ هر جلسه با یک کلیک تمام می‌شود.

### گسترش‌های بعدی (بدون تغییر اساسی معماری)
- **پیش‌نیاز سطح بازیکن**: اضافه کردن `minPlayerLevel` به `CoursePrerequisite` و چک در `arePrerequisitesMet`.
- **دوره‌های زنجیره‌ای**: همان سیستم پیش‌نیاز با `courseId`.
- **مهارت از کار**: در `executeAction("work", ...)` بسته به شغل، مقدار کمی XP به مهارت مرتبط اضافه شود.
- **درآمد بر اساس مهارت**: ضریب بر اساس `getSkillLevel(skillKey)` برای شغل فعلی در محاسبه حقوق.
- **کتاب‌های مهارتی در کتابخانه**: آیتم‌های جدا با `skillBoost` و بدون ساختار دوره؛ فقط یک بار مصرف و دادن XP مهارت.

---

## خلاصهٔ چک‌لیست پیاده‌سازی

1. **داده**: اضافه کردن `prerequisites` به دوره‌ها؛ در صورت تمایل ذخیرهٔ مهارت به صورت `totalXp`.
2. **استور**: در `completeSession` علاوه بر XP بازیکن، XP مهارت (`skillBoost`) را به مهارت مربوط اضافه کردن؛ در `enrollCourse` چک `arePrerequisitesMet`.
3. **فرمول سطح**: یک تابع مشترک `getSkillLevel(skillKey)` و در صورت نیاز `xpInCurrentLevel` / `maxXpInCurrentLevel` برای UI.
4. **UI**: نمایش پیش‌نیازهای برآورده‌نشده در کارت دوره و غیرفعال کردن ثبت‌نام در صورت عدم احراز.
5. **کتابخانه در اتاق**: اطمینان از اینکه ناوبری به صفحه دوره‌ها/مهارت‌ها انجام می‌شود و دورهٔ فعال و جلسهٔ مطالعه در دسترس است.

با این طراحی، کتابخانه به‌عنوان قلب **رشد مهارت و پیشرفت شغلی** عمل می‌کند، بدون اینکه منطق فعلی شغل و دوره را خراب کند و با حداقل تغییر در ساختار داده و استور قابل پیاده‌سازی است.
