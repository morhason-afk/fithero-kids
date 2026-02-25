Copy inventory (English → Hebrew suggestions) for FitHero Kids.  
These are suggested translations; adjust tone as needed.  
Locations are indicative (component or data file).

## Global / Branding

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| FitHero | פיט הירו | app/page.tsx, Footer, HeroSection, etc. |
| FitHero Kids | פיט הירו קידס | ShareButton, footer copyright |
| Move • Play • Grow! | זוזו • שחקו • גדלו! | app/page.tsx (tagline) |
| by YOM Games | מבית YOM Games | app/page.tsx, Footer |
| LV | דרג | app/page.tsx (level badge, shown as “LV 5”) |

## Header / Hero

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Level 5 | רמה 5 | HeroSection (badge mock text) |
| Ready to Move? | מוכנים לזוז? | HeroSection headline |
| Complete challenges, earn diamonds, and become the ultimate FitHero! | השלימו אתגרים, אספו יהלומים, ותהפכו לפיט הירו האולטימטיבי! | HeroSection subline |
| XP Progress | התקדמות ניסיון (XP) | HeroSection XP label |
| ✨ Play Now | ✨ שחקו עכשיו | HeroSection primary CTA button |
| Customize | התאמה אישית | HeroSection secondary CTA button |
| YOUR HERO | הגיבור שלכם | HeroCharacter |
| Level {level} • Champion | רמה {level} • אלוף | HeroCharacter subtitle (`{level}` is a number) |
| Edit hero name | עריכת שם הגיבור | HeroSection (aria-label on edit button) |

## Hero Name Editor

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Name your hero | תנו שם לגיבור שלכם | HeroNameEditor title |
| Choose a name that appears below your character. | בחרו שם שיופיע מתחת לדמות שלכם. | HeroNameEditor subtitle |
| Hero name | שם הגיבור | HeroNameEditor label |
| Please enter a name. | הזינו שם בבקשה. | HeroNameEditor validation |
| Name must be {MAX_LENGTH} characters or less. | השם חייב להיות באורך של {MAX_LENGTH} תווים לכל היותר. | HeroNameEditor validation (`{MAX_LENGTH}` is a number) |
| Cancel | ביטול | HeroNameEditor / SupportModal / WeeklyGoalSettings buttons |
| Save | שמירה | HeroNameEditor primary button |

## Footer

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Making fitness fun for the next generation of superheroes. | הופכים את הכושר לכיף עבור דור גיבורי-העל הבא. | Footer tagline |
| Game | משחק | Footer column title |
| Parents | הורים | Footer column title |
| Newsletter | ניוזלטר | Footer column title |
| Challenges | אתגרים | Footer link |
| Leaderboard | טבלת מובילים | Footer link |
| Rewards | פרסים | Footer link |
| Dashboard | לוח בקרה | Footer link (admin) |
| Safety | בטיחות | Footer link |
| Subscription | מנוי | Footer link |
| Contact support | יצירת קשר עם התמיכה | Footer button / SupportModal title |
| Parent's email | כתובת האימייל של ההורה | Footer newsletter placeholder & aria-label |
| Join | הצטרפות | Footer newsletter button |
| © {year} FitHero Kids • YOM Games • All rights reserved. | © ‎{year}‎ פיט הירו קידס • ‎YOM Games • כל הזכויות שמורות. | Footer copyright (`{year}` is a year number) |

## Weekly Goal (Display & Settings)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Weekly Goal | יעד שבועי | WeeklyGoalDisplay title & WeeklyGoalSettings header |
| Edit goal | עריכת היעד | WeeklyGoalDisplay (aria-label on settings button) |
| this week | השבוע | WeeklyGoalDisplay label after stars |
| Goal: {starsRequired} stars for a special treat! | יעד: ‎{starsRequired}‎ כוכבים בשביל הפתעה מיוחדת! | WeeklyGoalDisplay goal line |
| WEEKLY REWARD | פרס שבועי | WeeklyGoalDisplay reward card label |
| +500 Diamonds | ‎+500 יהלומים | WeeklyGoalDisplay reward preview text |
| +50 Stars | ‎+50 כוכבים | WeeklyGoalDisplay reward preview text |
| ⚙️ Configure Weekly Goal | ⚙️ הגדרת יעד שבועי | WeeklyGoalSettings header title |
| Stars Required This Week | מספר הכוכבים הדרושים השבוע | WeeklyGoalSettings label |
| Gift Description | תיאור הפרס | WeeklyGoalSettings label |
| e.g., a special treat, extra screen time, a new toy | למשל: הפתעה מיוחדת, עוד זמן מסך, צעצוע חדש | WeeklyGoalSettings placeholder |
| Notification Method | שיטת הודעה | WeeklyGoalSettings label |
| In-App Message | הודעה בתוך האפליקציה | WeeklyGoalSettings option |
| Email | אימייל | WeeklyGoalSettings option / labels |
| WhatsApp | וואטסאפ | WeeklyGoalSettings option |
| Browser Push Notification | התראת דפדפן (פוש) | WeeklyGoalSettings option |
| Email Address | כתובת אימייל | WeeklyGoalSettings conditional label |
| WhatsApp Number | מספר וואטסאפ | WeeklyGoalSettings conditional label |
| parent@example.com | parent@example.com | WeeklyGoalSettings placeholder (can remain as-is) |
| +1234567890 | ‎+1234567890‎ | WeeklyGoalSettings placeholder (example number) |
| Save Settings | שמירת הגדרות | WeeklyGoalSettings primary button |

### Weekly Goal Notifications (utils/weeklyGoal.ts)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| {childName} completed their weekly goal! They earned {stars} stars and deserve {gift}! 🎉 | ‎{childName}‎ סיים את היעד השבועי! הוא/היא הרוויח/ה ‎{stars}‎ כוכבים ומגיע לו/לה ‎{gift}‎! 🎉 | Notification message (`{childName}`, `{stars}`, `{gift}` stand for `childName`, `goal.starsRequired`, `goal.giftDescription`) |
| Weekly Goal Completed! 🎉 | היעד השבועי הושלם! 🎉 | Email / push notification subject & title |
| ✅ Email notification sent to {email}! | ✅ נשלחה הודעת אימייל אל ‎{email}‎! | Success alert |
| Failed to send email automatically: {error}\n\nWould you like to open your email client instead? | שליחת האימייל נכשלה אוטומטית: ‎{error}‎\n\nהאם לפתוח את תוכנת האימייל שלכם במקום? | Fallback confirm message |
| Error sending email: {message}\n\nWould you like to open your email client instead? | שגיאה בשליחת האימייל: ‎{message}‎\n\nהאם לפתוח את תוכנת האימייל שלכם במקום? | Fallback confirm message |
| Weekly Goal Completed! | היעד השבועי הושלם! | Mail subject in `mailto:` fallback |
| {childName} completed their weekly goal! They earned {stars} stars and deserve {gift}! | ‎{childName}‎ סיים את היעד השבועי! הוא/היא הרוויח/ה ‎{stars}‎ כוכבים ומגיע לו/לה ‎{gift}‎! | Mail body text (without emoji) |

## Challenges List & Popup

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Challenges | אתגרים | ChallengeSelection title & footer link |
| {count} available | ‎{count}‎ זמינים | ChallengeSelection meta text (`{count}` is a number) |
| Need {stars} star(s) on {previousChallenge} | צריך ‎{stars}‎ כוכב/ים באתגר „{previousChallenge}” | ChallengeSelection lock reason |
| previous challenge | האתגר הקודם | ChallengeSelection fallback when previous title missing |
| Subscribe to unlock | מנוי נדרש לפתיחה | ChallengeSelection lock reason / Subscription contexts |
| UNLOCK NOW | לפתוח עכשיו | ChallengeSelection button on locked card |
| New | חדש | ChallengeSelection tag |
| Popular | פופולרי | ChallengeSelection tag |
| {duration} sec | ‎{duration}‎ שניות | ChallengeSelection duration label |

### Challenge Popup (ChallengePopup.tsx)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Duration | משך זמן | ChallengePopup info label (“⏱️ Duration”) |
| {duration} seconds | ‎{duration}‎ שניות | ChallengePopup value |
| Goal | מטרה | ChallengePopup info label (“🎯 Goal”) |
| Hit at least 50% of targets with punches | פגעו בלפחות 50% מהמטרות עם אגרופים. | Boxing goal text |
| Slice at least 50% of fruits with your hands | חתכו לפחות 50% מהפירות עם הידיים. | Fruit Ninja goal text |
| Complete challenge | השלימו את האתגר | Default goal text |
| Reward | פרס | ChallengePopup reward label |
| 20-60 diamonds | ‎20–60 יהלומים | ChallengePopup reward text |
| 🎮 Start Challenge! | 🎮 התחלת אתגר! | ChallengePopup start button |

### Challenge Data (data/challenges.ts)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Jumping Jacks | קפיצות במקום (Jumping Jacks) | Challenge title |
| Do as many jumping jacks as you can in 15 seconds! | עשו כמה שיותר קפיצות במקום במשך 15 שניות! | Challenge description |
| Squat Power | כוח סקואט | Challenge title |
| Do as many squats as you can in 15 seconds! | עשו כמה שיותר סקואטים במשך 15 שניות! | Challenge description |
| Dance Party | מסיבת ריקודים | Challenge title |
| Dance your best moves for 15 seconds! | רקדו את התנועות הכי טובות שלכם במשך 15 שניות! | Challenge description |
| High Knees | ברכיים גבוהות | Challenge title |
| Run in place with high knees for 15 seconds! | רוצו במקום עם ברכיים גבוהות במשך 15 שניות! | Challenge description |
| Push-ups | שכיבות סמיכה | Challenge title |
| Do as many push-ups as you can in 15 seconds! | עשו כמה שיותר שכיבות סמיכה במשך 15 שניות! | Challenge description |
| Plank Hold | פלאנק סטטי | Challenge title |
| Hold a plank position for 15 seconds! | החזיקו תנוחת פלאנק במשך 15 שניות! | Challenge description |
| Boxing Challenge | אתגר אגרוף | Challenge title |
| Throw punches at the targets! Show your boxing skills! | זרקו אגרופים למטרות! הראו את כישורי האגרוף שלכם! | Challenge description |
| Fruit Ninja | פרוט נינג׳ה | Challenge title |
| Wave your hands to hit the falling objects! | נופפו בידיים כדי לפגוע בעצמים הנופלים! | Challenge description |

### Exercise Instructions (data/exerciseInstructions.ts)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Stand with your feet together and arms at your sides | עמדו כשכפות הרגליים צמודות והידיים לצדי הגוף. | Jumping jacks step |
| Jump up and spread your legs apart | קפצו והרחיקו את הרגליים זו מזו. |  |
| At the same time, raise your arms above your head | באותו זמן הרימו את הידיים מעל הראש. |  |
| Jump back to starting position | חזרו לקפיצה למצב ההתחלה. |  |
| Repeat as fast as you can! | חזרו על התנועה כמה שיותר מהר! |  |
| Stand with feet shoulder-width apart | עמדו בפיסוק ברוחב הכתפיים. | Squats |
| Lower your body by bending your knees | הורידו את הגוף באמצעות כיפוף הברכיים. |  |
| Keep your back straight and chest up | שמרו על גב ישר וחזה מורם. |  |
| Go down until your thighs are parallel to the floor | רדו עד שהירכיים מקבילות לרצפה. |  |
| Push back up to standing position | עלו חזרה לעמידה. |  |
| Repeat! | חזרו על התרגיל! | Various exercises |
| Move your body to the rhythm | הזיזו את הגוף בקצב המוזיקה. | Dancing |
| Wave your arms in the air | נופפו בידיים באוויר. |  |
| Move your hips and shake | הזיזו את האגן והתנערו. |  |
| Have fun and be creative! | תהנו והיו יצירתיים! |  |
| Show your best dance moves! | הראו את תנועות הריקוד הכי טובות שלכם! |  |
| Stand in place | עמדו במקום. | High knees |
| Lift one knee up toward your chest | הרימו ברך אחת לכיוון החזה. |  |
| Quickly switch to the other knee | החליפו מהר לברך השנייה. |  |
| Keep alternating as fast as you can | המשיכו להחליף כמה שיותר מהר. |  |
| Pump your arms like you're running! | הזיזו את הזרועות כמו בריצה! |  |
| Start in plank position on hands and toes | התחילו בעמדת פלאנק על כפות הידיים והאצבעות. | Push-ups |
| Keep your body straight like a board | שמרו על הגוף ישר כמו לוח. |  |
| Lower your body by bending your arms | הורידו את הגוף על ידי כיפוף המרפקים. |  |
| Push back up to starting position | דחפו חזרה לעמדת ההתחלה. |  |
| Start on your hands and toes | התחילו על כפות הידיים והאצבעות. | Plank |
| Keep your body straight and strong | שמרו על גוף ישר וחזק. |  |
| Hold this position | החזיקו את התנוחה. |  |
| Don't let your hips sag or rise | אל תתנו לאגן לצנוח או לעלות. |  |
| Stay strong until time is up! | הישארו חזקים עד סוף הזמן! |  |
| Stand facing the camera | עמדו מול המצלמה. | Boxing / Fruit Ninja |
| Make fists with both hands | כסו את כפות הידיים לאגרופים. | Boxing |
| Throw punches at the targets | זרקו אגרופים לעבר המטרות. |  |
| Alternate between left and right punches | החליפו בין אגרופים ביד שמאל לימין. |  |
| Keep your guard up and have fun! | שמרו על הגנה ותיהנו! |  |
| Watch for objects falling from the sky | שימו לב לעצמים שנופלים מלמעלה. | Fruit Ninja |
| Wave your hands to hit them | נופפו בידיים כדי לפגוע בהם. |  |
| Move your arms up and down quickly | הזיזו את הידיים למעלה ולמטה במהירות. |  |
| Try to hit as many as you can! | נסו לפגוע בכמה שיותר! |  |

## Subscription Modal

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Unlock All Challenges | פתיחת כל האתגרים | SubscriptionModal title |
| Unlock All Character Options | פתיחת כל אפשרויות הדמות | SubscriptionModal title |
| Unlock All Face Options | פתיחת כל אפשרויות הפנים | SubscriptionModal title |
| Challenges 1–4 are free. From challenge 5 onward: subscribe to play the rest! | אתגרים 1–4 בחינם. מהאתגר ה־5 ואילך יש צורך במנוי כדי לשחק בכולם! | SubscriptionModal description |
| First 5 in each category (skin, outfit, accessories) are free or for diamonds. Subscribe to unlock the rest! | חמש האפשרויות הראשונות בכל קטגוריה (עור, תלבושת, אביזרים) חינמיות או ניתנות לקנייה ביהלומים. מנוי פותח את כל השאר! | SubscriptionModal description |
| First 5 in each category (eyes, mouth, accessory, background) are free or for diamonds. Subscribe to unlock the rest! | חמש האפשרויות הראשונות בכל קטגוריה (עיניים, פה, אביזר, רקע) חינמיות או ניתנות לקנייה ביהלומים. מנוי פותח את כל השאר! | SubscriptionModal description |
| Free | חינם | Subscription price display |
| {price} USD/month | ‎{price}‎ דולר לחודש | Subscription price display (`{price}` is like 4.99) |
| Card number | מספר כרטיס | Subscription form label |
| Expiry (MM/YY) | תוקף (MM/YY) | Subscription form label |
| CVC | CVC | Subscription form label (can remain) |
| Invalid card. For demo use CVC 669. | הכרטיס אינו תקין. לדמו השתמשו בקוד CVC ‎669‎. | Subscription validation |
| Please enter a valid card number (any digits). | הזינו מספר כרטיס תקין (כל ספרות). | Subscription validation |
| Processing… | מעבד… | Subscription button loading text |
| Subscribe | להירשם למנוי | Subscription primary button |
| Demo: use any card number and CVC 669 | דמו: ניתן להשתמש בכל מספר כרטיס וב־CVC ‎669‎. | Subscription demo hint |

## Support Modal

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Contact support | יצירת קשר עם התמיכה | SupportModal title / footer button |
| Fill in your details and we'll open your email app to send a message to support. | מלאו את הפרטים שלכם ונפתח את אפליקציית האימייל כדי לשלוח הודעה לתמיכה. | SupportModal description |
| First name | שם פרטי | SupportModal label & placeholder |
| Last name | שם משפחה | SupportModal label & placeholder |
| Email | אימייל | SupportModal label |
| Description | תיאור | SupportModal label |
| How can we help? | איך נוכל לעזור? | SupportModal textarea placeholder |
| Send email | שליחת אימייל | SupportModal primary button |
| Support request from {firstName} {lastName} | בקשת תמיכה מ־{firstName} {lastName} | Email subject |
| First name: {first}\nLast name: {last}\nEmail: {email}\n\nDescription:\n{description} | שם פרטי: {first}\nשם משפחה: {last}\nאימייל: {email}\n\nתיאור:\n{description} | Email body template |

## Result Screen & Scoring

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Amazing! | מדהים! | utils/scoring getResultTitle (3 stars) |
| Great job! | עבודה נהדרת! | utils/scoring getResultTitle (2 stars) |
| Try again | נסו שוב | utils/scoring getResultTitle (≤1 star), ResultDisplay button text |
| NEW PERSONAL BEST! | שיא אישי חדש! | ResultDisplay badge |
| Diamonds | יהלומים | ResultDisplay reward label / BalanceBar |
| Stars | כוכבים | ResultDisplay reward label / BalanceBar |
| Home | בית | ResultDisplay button |
| Play Again! | לשחק שוב! | ResultDisplay button (good result) |
| Try Again | נסו שוב | ResultDisplay button (lower result) |

### ExerciseVerifier Feedback

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Analyzing your exercise... | מנתחים את התרגיל שלכם... | ExerciseVerifier status |
| Loading video... | טוען וידאו... | ExerciseVerifier step |
| Detecting movements... | מזהה תנועות... | ExerciseVerifier step |
| Analyzing form... | מנתח את הביצוע... | ExerciseVerifier step |
| Calculating score... | מחשב ציון... | ExerciseVerifier step |
| Complete! | הושלם! | ExerciseVerifier step |
| Amazing! You did the exercise as instructed. You got {stars} stars on {title}! 🌟 | מדהים! ביצעתם את התרגיל כמו שצריך. קיבלתם ‎{stars}‎ כוכבים על „{title}”! 🌟 | High-score feedback |
| Great job! You did the exercise well. You got {stars} stars on {title}! 👏 | עבודה נהדרת! ביצעתם את התרגיל טוב. קיבלתם ‎{stars}‎ כוכבים על „{title}”! 👏 | Medium-score feedback |
| You're getting there! Follow the instructions more closely to earn more stars. Try again! 💪 | אתם בדרך הנכונה! עקבו אחרי ההוראות יותר במדויק כדי להרוויח עוד כוכבים. נסו שוב! 💪 | Low-score feedback |
| You didn't do the challenge as instructed. Move more and follow the instructions! Try again. 🚀 | לא ביצעתם את האתגר לפי ההוראות. זוזו יותר ועקבו אחרי ההנחיות! נסו שוב. 🚀 | Zero-star feedback |
| Checking your moves... | בודקים את התנועות שלכם... | ExerciseVerifier title |

## Camera & Interactive Challenges

### Shared / Camera Errors

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Could not access camera. Please check permissions. | לא ניתן לגשת למצלמה. בדקו את ההרשאות. | FruitNinjaChallenge, BoxingChallenge |
| Camera access denied | הגישה למצלמה נחסמה | FruitNinjaChallenge, BoxingChallenge, CameraRecorder |
| Camera permission was denied. Please allow camera access in your browser settings and try again. | הרשאת המצלמה נדחתה. אפשרו גישה למצלמה בהגדרות הדפדפן ונסו שוב. | CameraRecorder |
| No camera found. Please connect a camera and try again. | לא נמצאה מצלמה. חברו מצלמה ונסו שוב. | CameraRecorder |
| Could not access camera. Please check your camera permissions and try again. | לא ניתן לגשת למצלמה. בדקו את הרשאות המצלמה ונסו שוב. | CameraRecorder |
| Camera not available | המצלמה אינה זמינה | CameraRecorder |
| Failed to start recording. Please try again. | לא ניתן להתחיל הקלטה. נסו שוב. | CameraRecorder |
| Try Again | נסו שוב | CameraRecorder / BoxingChallenge / FruitNinjaChallenge buttons |

### CameraRecorder HUD & Messages

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Requesting camera access... | מבקשים גישה למצלמה... | CameraRecorder loading |
| Please allow camera access when prompted | אפשרו גישה למצלמה כשהדפדפן מבקש זאת | CameraRecorder loading subtext |
| 🎥 Recording Your Challenge | 🎥 מקליטים את האתגר שלכם | CameraRecorder title |
| REC | הקלטה | CameraRecorder HUD |
| Recording… Complete the challenge to finish. | מקליטים… השלימו את האתגר כדי לסיים. | CameraRecorder hint |
| 💡 Tips: | 💡 טיפים: | CameraRecorder section title |
| Make sure you're in a well-lit area | ודאו שאתם באזור מואר היטב. | CameraRecorder tip |
| Stay in frame during the entire exercise | הישארו בתוך הפריים לאורך כל התרגיל. | CameraRecorder tip |
| Follow the exercise instructions carefully | עקבו בקפידה אחרי הוראות התרגיל. | CameraRecorder tip |
| ▶️ Start Recording | ▶️ התחלת הקלטה | CameraRecorder button |

### CameraRecorder Encouragement Messages

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Great start! Keep going! 💪 | התחלה מעולה! תמשיכו! 💪 | Positive motion |
| You're doing great! 🌟 | אתם עושים עבודה נהדרת! 🌟 |  |
| Halfway there! Keep it up! 🔥 | חצי הדרך מאחוריכם! המשיכו ככה! 🔥 |  |
| You're amazing! 💪 | אתם מדהימים! 💪 |  |
| Almost there! 5 more seconds! ⏱️ | כמעט שם! עוד 5 שניות! ⏱️ |  |
| 3... Keep it up! 🔥 | 3... להמשיך! 🔥 |  |
| 2... Almost done! 🎯 | 2... כמעט סיימנו! 🎯 |  |
| 1... Last second! 🚀 | 1... השנייה האחרונה! 🚀 |  |
| Let's see those moves! Get moving! 💪 | בואו נראה את התנועות שלכם! לזוז! 💪 | Low motion |
| Keep moving! Show us your best! 🏃 | תמשיכו לזוז! תראו את הכי טוב שלכם! 🏃 |  |
| Keep going! Move your body! 🔥 | תמשיכו! הזיזו את הגוף! 🔥 |  |
| Almost there — keep moving! 💪 | כמעט שם — תמשיכו לזוז! 💪 |  |
| 5 seconds left — give it your all! ⏱️ | נשארו 5 שניות — תנו את כל מה שיש לכם! ⏱️ |  |
| 3... Keep moving! 🔥 | 3... תמשיכו לזוז! 🔥 |  |
| 2... Push through! 🎯 | 2... להמשיך עד הסוף! 🎯 |  |
| 1... Last second! 🚀 | 1... השנייה האחרונה! 🚀 |  |
| Awesome! You did it! 🎉 | אלופים! עשיתם את זה! 🎉 | Completion with good motion |
| Done! Keep practicing to earn more stars! 🌟 | סיימתם! המשיכו להתאמן כדי להרוויח עוד כוכבים! 🌟 | Completion with low motion |

### Fruit Ninja Challenge

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| 🍎 Fruit Ninja Challenge | 🍎 אתגר פרוט נינג׳ה | FruitNinjaChallenge title |
| Loading camera... | טוען מצלמה... | FruitNinjaChallenge overlay |
| 🍎 Score: {score} | 🍎 ניקוד: ‎{score}‎ | HUD label |
| ⏱️ 0:{time} | ⏱️ 0:{time} | Timer (numbers kept) |
| Sliced: {hits} 🍎 | פרות שנחתכו: ‎{hits}‎ 🍎 | HUD label |
| 🚀 Start Challenge! | 🚀 התחלת אתגר! | Start button (also in Boxing) |
| Complete the challenge before time runs out! | השלימו את האתגר לפני שייגמר הזמן! | Recording hint |
| 💡 Tap or click fruits to slice them — or wave your hands in front of the camera! | 💡 הקליקו או הקישו על הפירות כדי לחתוך אותם — או נופפו בידיים מול המצלמה! | Instruction text |
| Slice as many as you can before time runs out. | חתכו כמה שיותר פירות לפני שייגמר הזמן. | Instruction text |

### Boxing Challenge

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| 🥊 Boxing Challenge | 🥊 אתגר אגרוף | BoxingChallenge title |
| Loading camera... | טוען מצלמה... | BoxingChallenge overlay |
| ⭐ {score} | ⭐ ‎{score}‎ | HUD score label |
| 0:{time} | 0:{time} | Timer |
| COMBO x{punches} 🔥 | קומבו ×{punches} 🔥 | HUD label |
| 🚀 Start Challenge! | 🚀 התחלת אתגר! | Start button |
| Complete the challenge before time runs out! | השלימו את האתגר לפני שייגמר הזמן! | Recording hint |
| 💡 Throw punches at the targets! | 💡 זרקו אגרופים לעבר המטרות! | Instruction text |
| Extend your arms quickly to hit them! | הושיטו את הידיים במהירות כדי לפגוע בהן! | Instruction text |

## Sharing / Social

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Check out my FitHero Kids character! I'm Level {level} with {outfitName}! 🦸 #FitHeroKids\n\nPlay too: {url} | תראו את הדמות שלי בפיט הירו קידס! אני ברמה ‎{level}‎ עם תלבושת „{outfitName}”! 🦸 ‎#FitHeroKids‎\n\nגם אתם מוזמנים לשחק: ‎{url}‎ | ShareButton share text |
| Preparing… | מכין… | ShareButton state text |
| Share | שיתוף | ShareButton label |
| Share my character image and message on WhatsApp | שיתוף תמונת הדמות וההודעה שלי ב־WhatsApp | ShareButton aria-label |
| FitHero Kids – My character | פיט הירו קידס – הדמות שלי | ShareButton share title |

## Hero Customizer & Items

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| 🎨 Customize Your Hero | 🎨 התאימו את הגיבור שלכם | HeroCustomizer header |
| First 5 in each category (skin, outfit, accessories) free or for diamonds • Rest require subscription | חמש האפשרויות הראשונות בכל קטגוריה (עור, תלבושת, אביזרים) חינמיות או דורשות יהלומים • השאר דורשות מנוי | HeroCustomizer hint |
| Skin | צבע עור | HeroCustomizer label |
| Outfit | תלבושת | HeroCustomizer label |
| Accessories | אביזרים | HeroCustomizer label |
| Classic | קלאסי | Skin option name |
| Tan | שזוף | Skin option name |
| Warm | חמים | Skin option name |
| Cool | קריר | Skin option name |
| Light | בהיר | Skin option name |
| Deep | כהה | Skin option name |
| Bronze | ברונזה | Skin option name |
| Mocha | מוקה | Skin option name |
| Red | אדום | Outfit option name |
| Blue | כחול | Outfit option name |
| Green | ירוק | Outfit option name |
| Purple | סגול | Outfit option name |
| Yellow | צהוב | Outfit option name |
| Orange | כתום | Outfit option name |
| Pink | ורוד | Outfit option name |
| Cyan | ציאן | Outfit option name |
| Gold | זהב | Outfit option name |
| Teal | טורקיז כהה | Outfit option name |
| None | ללא | Accessory option name |
| Cape | גלימה | Accessory option / HERO_OPTIONS |
| Belt | חגורה | Accessory option |
| Gloves | כפפות | Accessory option |
| Crown | כתר | Accessory option / HERO_OPTIONS |
| Wings | כנפיים | Accessory option |
| Scarf | צעיף | Accessory option |
| Shield | מגן | Accessory option |
| Requires subscription | דורש מנוי | HeroCustomizer tooltip / swatch label |
| Subscribe | להירשם למנוי | HeroCustomizer button/label |
| Owned | בבעלותכם | HeroCustomizer badge |
| Not enough diamonds! You need {cost} diamonds. You have {current} diamonds. | אין מספיק יהלומים! אתם צריכים ‎{cost}‎ יהלומים. יש לכם ‎{current}‎ יהלומים. | HeroCustomizer alert |

### Heroes (data/heroes.ts)

| English | Hebrew (suggested) | Location |
| --- | --- | --- |
| Superman Hero | גיבור־על קלאסי | Hero option name |
| Classic superhero with red cape | גיבור־על קלאסי עם גלימה אדומה | Description |
| Purple Heroine | גיבורת־על סגולה | Name |
| Teal armored heroine with purple hair | גיבורת־על בשריון טורקיז ושיער סגול | Description |
| Dark Purple Heroine | גיבורת־על סגולה כהה | Name |
| Teal suit heroine with wavy purple hair | גיבורת־על בחליפה טורקיז ושיער סגול גלי | Description |
| Green Speedster | מהיר ירוק | Name |
| Energetic speedster with green spiky hair | מהיר אנרגטי עם שיער ירוק קוצים | Description |
| Barbarian Warrior | לוחם ברברי | Name |
| Powerful barbarian with fur tunic | ברברי חזק עם טוניק פרווה | Description |
| Caped Barbarian | ברברי עם גלימה | Name |
| Barbarian hero with blue top and cape | גיבור ברברי עם חולצה כחולה וגלימה | Description |
| Pink Speedster | מהירה ורודה | Name |
| Dynamic speedster with pink curly hair | מהירה דינמית עם שיער ורוד מתולתל | Description |
| Scientist Mage | מדען קוסם | Name |
| Smart hero with glasses and energy orb | גיבור חכם עם משקפיים וכדור אנרגיה | Description |
| White Armored Hero | גיבור משוריין לבן | Name |
| Sleek silver and purple armored suit | שריון אלגנטי בצבע כסף וסגול | Description |
| Stealth Hero | גיבור מסתורי | Name |
| Dark stealth hero with purple glow | גיבור חשאי כהה עם הילה סגולה | Description |
| Bee Gadgeteer | גיבור דבורה טכנולוגי | Name |
| Tactical bee-themed hero | גיבור טקטי בנושא דבורה | Description |
| Happy Bee Child | ילד/ה דבורה שמח/ה | Name |
| Joyful bee child with wings | ילד/ה דבורה שמח/ה עם כנפיים | Description |

---

If you add new copy strings in the app, append them to this file with their suggested Hebrew translation so localization stays in sync.

