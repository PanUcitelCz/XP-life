<script lang="ts">
    let language = $state<'en' | 'cz'>('en');
</script>

<svelte:head>
    <title>XP-life Information</title>
</svelte:head>

<div class="info-container">
    <section class="info-box">
        <script lang="ts">
            let language = $state<'en' | 'cz'>('en'); // Výchozí jazyk
        </script>

        <div class="language-switcher">
            <button
                class:active={language === 'en'}
                onclick={() => language = 'en'}
            >
                EN
            </button>
            <button
                class:active={language === 'cz'}
                onclick={() => language = 'cz'}
            >
                CZ
            </button>
        </div>

    {#if language === 'en'}
            <div>
                <h1>XP-life Information</h1>
                <p>
                    Welcome to XP-life!</p>
                    <p>This self-improvement browser app is designed to help you gamify your everyday life, motivating you to balance your daily activities while encouraging personal growth. Inspired by RPG games, XP-life allows you to track your progress and level up your character, unlocking your true potential.
                </p>
                <p>
                    Created as part of Eliška Rohlíková’s psychology bachelor’s thesis, with the support of skilled programmer Peter Breit. XP-life is your companion on the journey to a more fulfilling and balanced life. Start your adventure today!
                </p>

                <h2>How to get started?</h2>
                <h3>Creating an Account on XP-life</h3>
                <ol>
                    <li>Open the XP-life homepage in your browser.</li>
                    <li>Select the Register option.</li>
                    <li>Enter the required details: your Email Address, Nickname, and Password.</li>
                    <li>Click Register a New Account to complete your registration.</li>
                    <li>Check your email for a confirmation link and follow the instructions to verify your account.</li>
                </ol>
                <p>Congratulations! Your XP-life account has been successfully created.</p>

                <h2>Navigating XP-life: An Overview of Core Features</h2>
                <h3>Your Character</h3>
                <ul>
                    <li>
                        <strong>Profile picture:</strong> After logging in to XP-life you will see a profile picture of your character. In case you’re not a fan of the first one, you can change it by clicking on the profile picture and selecting a different profile picture from the choice display.
                    </li>
                    <li>
                        <strong>Level:</strong> The number displayed next to your profile picture is your characters level. Level of your character is based on the lowest level, that you have acquired in all of your Stats.
                    </li>
                    <li>
                        <strong>XP = experience points:</strong> XP are a way to measure your progress in XP-life. You can earn XP by completing daily tasks and quests. As you accumulate XP, they level up your stats and eventually your level.
                    </li>
                </ul>

                <h3>Stats</h3>
                <p>
                    Stats are very important in XP-life, because that is what defines your character. They are serving as a visual representation of what you’re focusing on most in your life. They highlight your strengths and growth areas, reflecting your personal journey and progress.
                </p>
                <p>There are 6 different stats: Strength, Dexterity, Constitution, Intelligence, Wisdom and Charisma.</p>

                <h3>Strength</h3>
                <p>This stat represents your physical power. Higher strength allows you to perform tasks that require physical effort more effectively. Think of it as your muscle power.</p>

                <h3>Dexterity</h3>
                <p>Dexterity is all about agility, speed, and reflexes. A higher dexterity stat makes you better at tasks that require quick movements or precise actions, like dodging or handling delicate tools.</p>

                <h3>Constitution</h3>
                <p>Constitution measures your endurance and stamina. A high constitution means you can handle more physical stress, resist fatigue, and stay resilient in challenging situations.</p>

                <h3>Intelligence</h3>
                <p>Intelligence reflects your problem-solving ability and knowledge. The higher your intelligence, the better you are at learning, understanding complex information, and strategizing.</p>

                <h3>Wisdom</h3>
                <p>Wisdom is about insight, perception, and making sound decisions. With high wisdom, you’re more aware of your surroundings and better at recognizing patterns, which helps in decision-making.</p>

                <h3>Charisma</h3>
                <p>Charisma gauges your social influence and likability. A higher charisma stat improves your ability to communicate, persuade, and inspire others.</p>

                <h2>How to earn XP?</h2>
                <p>There are two ways to earn Experience Points (XP) in XP-life: through Daily Activities and through Quests.</p>
                <h3>Daily activities</h3>
                <p>Daily Activities are real-life tasks that you choose to engage in based on your interests and how you want to spend your time. These activities are fully customizable and entirely up to you. Take a moment to reflect on your daily routine and hobbies, and then assign each activity you wish to pursue or improve upon to one of the 6 Stats.</p>
                <p>It’s important to remember that you don’t need to complete every activity every day. While some activities can be daily tasks, you can also include activities that you do every other day, once a week, or even once a month.</p>
                <p>Once you have determined which activities you want to pursue, you need to assign an amount of XP to each activity based on how hard it is for you to complete. Choose from the following options:</p>
                <ul>
                    <li>5 XP for Easy tasks</li>
                    <li>10 XP for Normal tasks</li>
                    <li>15 XP for Hard tasks</li>
                </ul>
                <p>Here are some examples for Daily activities for each of your stats:</p>
                <ul>
                    <li><strong>Strength:</strong> Rock climbing, Weightlifting, Gardening, Running</li>
                    <li><strong>Dexterity:</strong> Playing a musical instrument, Knitting or crocheting, Table tennis</li>
                    <li><strong>Constitution:</strong> Cooking, 8 hours of sleep, Eating healthy</li>
                    <li><strong>Intelligence:</strong> Doing homework, Sudoku or crossword puzzles, Chess, Learning a new language</li>
                    <li><strong>Wisdom:</strong> Journaling, Meditation, Reading philosophy or self-help books</li>
                    <li><strong>Charisma:</strong> Public speaking or storytelling, Acting or improv, Hosting gatherings, Meeting with friends for a coffee</li>
                </ul>

                <h3>Quests</h3>
                <p>Quests are another way to earn XP and are also based on real life activities that you want to focus on. Quests are, however, different from Daily activities in a few ways. The main focus of Daily activities is, that you have spent time during your day on those activities. Quests on the other hand should have a definitive beginning and an end. Quests should be something that you can finish, tick off your to-do list. Quests can corelate to your daily activities, but they should be possible to complete.</p>
                <p>By completing a Quest you get 100 XP, so choose wisely what task are you going to turn into a Quest. You don’t want your Quests to be too easy, they should be a challenge in some way. But you also don’t want them to be impossible to complete, so that XP-life keeps on motivating you. </p>
                <p>Here are some examples for Daily activities for each of your stats:</p>

                <h3>Examples of Quests</h3>
                <ul>
                    <li><strong>Strength:</strong> Complete a 5k run, Do 50 push-ups in one session, Carry out a major home project</li>
                    <li><strong>Dexterity:</strong> Learn a new song on an instrument, Improve your flexibility: Complete a 30-day stretching challenge, Finish a small sewing or painting project</li>
                    <li><strong>Constitution:</strong> Hike for 3 hours without a break, Complete a week of daily exercise, Reduce screen time by 50% for a week, Eat healthy for 30 days</li>
                    <li><strong>Intelligence:</strong> Finish reading a book, Complete a beginner’s course in something new</li>
                    <li><strong>Wisdom:</strong> Complete a 30-day gratitude challenge, Spend a day unplugged, Plan a day of self-care, Create a vision board</li>
                    <li><strong>Charisma:</strong> Host a game or movie night, Give a presentation or public speech, Compliment three people in one day, Attend a social event alone, Initiate a conversation with a stranger, Make someone smile every day for a week</li>
                </ul>

                <h2>How to Edit Daily activities?</h2>

                <h3>How to Add a New Activity:</h3>
                <ol>
                    <li>Go to your profile page and click on Edit Activity located under your profile picture.</li>
                    <li>In the Add Activity window that opens, start by selecting the Stat that best aligns with this activity. You can choose from any of the 6 Stats based on the activity’s nature.</li>
                    <li>Enter the name of your activity in the provided field.</li>
                    <li>Optionally, you can add a short description to further explain the activity.</li>
                    <li>Next, choose the XP value for this activity from the three options provided.</li>
                    <li>Once you’ve entered all the details, click Add Activity to save.</li>
                </ol>

                <h3>How to Disable an Activity:</h3>
                <ol>
                    <li>Open the Add Activity window and select Remove/Disable Activity. This will bring up the Manage Activity window.</li>
                    <li>In the Manage Activity window, go to Choose Action at the bottom and select Disable.</li>
                    <li>Next, choose the category that contains the activity you want to disable.</li>
                    <li>Select the specific activity you wish to disable from the list.</li>
                    <li>Finally, click Accept Change to save your update.</li>
                </ol>

                <h3>How to Enable an Activity:</h3>
                <ol>
                    <li>Open the Add Activity window and select Remove/Disable Activity. This will bring up the Manage Activity window.</li>
                    <li>In the Manage Activity window, go to Choose Action at the bottom and select Enable.</li>
                    <li>Next, choose the category that contains the activity you want to enable.</li>
                    <li>Select the specific activity you wish to enable from the list.</li>
                    <li>Finally, click Accept Change to save your update.</li>
                </ol>

                <h3>How to Delete an Activity:</h3>
                <ol>
                    <li>In the Manage Activity window, go to Choose Action at the bottom and select Delete.</li>
                    <li>Select the category that includes the activity you want to delete.</li>
                    <li>Choose the specific activity you wish to delete from the list.</li>
                    <li>A prompt will appear with instructions to type “DELETE MY [Activity Name]” to confirm. Replace [Activity Name] with the exact name of the selected activity.</li>
                    <li>Enter “DELETE MY [Activity Name]” as instructed.</li>
                    <li>Click Accept Change to confirm and save your update.</li>
                </ol>
                <p>Please note that once you delete an activity all the XP you have gained from that activity will be deleted as well!</p>

                <h2>How to set up Quests?</h2>

                <h3>How to Add a Quest:</h3>
                <ol>
                    <li>Go to your Quests page and select Add Quest.</li>
                    <li>Enter a title for your quest in the designated field.</li>
                    <li>Provide a brief description outlining the details of the quest.</li>
                    <li>Choose the category that best aligns with the stat your quest relates to.</li>
                    <li>Click Add Quest to save your new quest.</li>
                </ol>

                <h3>How to Delete a Quest:</h3>
                <ol>
                    <li>Go to your Quests page and select Delete Quest.</li>
                    <li>Choose the quest you wish to delete from the list.</li>
                    <li>Type “DELETE [Quest Name]” to confirm your selection.</li>
                    <li>Click Delete to complete the process.</li>
                </ol>
            </div>
            {:else if language === 'cz'}
            <div>
                <h1>XP-life Informace</h1>
                <p>
                    Vítejte v XP-life!
                    Tato aplikace pro seberozvoj je navržena tak, aby přidala herní prvky do vašeho života, motivovala vás k přemýšlení nad každodenními činnostmi, pomohla hledat rovnováhu a podpořila váš osobní růst. XP-life, inspirovaný RPG hrami, vám umožňuje sledovat váš pokrok, zvyšovat úroveň vaší postavy a objevovat svůj skutečný potenciál.
                </p>
                <p>
                    Aplikace byla vytvořena v rámci bakalářské práce Elišky Rohlíkové ve spolupráci se zkušeným programátorem Petrem Breitem. XP-life je vaším společníkem na cestě k naplňujícímu a vyváženějšímu životu. Začněte své dobrodružství ještě dnes!
                </p>

                <h2>Jak začít?</h2>
                <h3>Vytvoření účtu na XP-life</h3>
                <ol>
                    <li>Otevřete domovskou stránku XP-life ve svém prohlížeči.</li>
                    <li>Vyberte možnost Registrovat.</li>
                    <li>Zadejte požadované údaje: svou e-mailovou adresu, přezdívku a heslo.</li>
                    <li>Kliknutím na možnost Zaregistrovat nový účet dokončete registraci.</li>
                    <li>Zkontrolujte svůj e-mail, zda nemáte potvrzovací odkaz, a podle pokynů ověřte svůj účet.</li>
                </ol>
                <p>Blahopřejeme! Váš XP-life účet byl úspěšně vytvořen.</p>

                <h2>Navigace v XP-life: Přehled základních funkcí</h2>
                <h3>Váš charakter</h3>
                <ul>
                    <li>
                        <strong>Profilový obrázek:</strong> Po přihlášení do XP-life se vám zobrazí profilový obrázek vaší postavy. V případě, že nejste fanouškem prvního z nich, můžete jej změnit kliknutím na profilový obrázek a výběrem jiného profilového obrázku z výběru.
                    </li>
                    <li>
                        <strong>Úroveň:</strong> Číslo zobrazené vedle vašeho profilového obrázku představuje úroveň vaší postavy. Úroveň vaší postavy se odvíjí od nejnižší úrovně, kterou jste získali ve všech svých statistikách.
                    </li>
                    <li>
                        <strong>XP = zkušenostní body:</strong> XP jsou způsob, jak měřit svůj pokrok v XP-life. XP můžete získat díky plnění denních úkolů. Jak hromadíte XP, zvyšují vaše Staty a nakonec i vaši úroveň.
                    </li>
                </ul>

                <h2>Vlastnosti</h2>
                <p>
                    Vlastnosti jsou v XP-life velmi důležité, protože to je to, co definuje vaši postavu. Slouží jako vizuální znázornění toho, na co se ve svém životě nejvíce zaměřujete. Zdůrazňují vaše silné stránky a oblasti růstu a odrážejí vaši osobní cestu a pokrok.
                </p>
                <p>K dispozici je 6 různých statistik: síla, obratnost, výdrž, inteligence, moudrost a charisma.</p>

                <h3>Síla</h3>
                <p>
                    Tato vlastnost představuje vaši fyzickou sílu. Vyšší síla vám umožní efektivněji provádět úkoly, které vyžadují fyzickou námahu. Představte si to jako sílu vašich svalů.
                </p>

                <h3>Obratnost</h3>
                <p>
                    Obratnost je především o hbitosti, rychlosti a reflexech. Díky vyšším statistikám obratnosti se zlepšujete v úkolech, které vyžadují rychlé pohyby nebo přesné akce, jako je uhýbání nebo manipulace s jemnými nástroji.
                </p>

                <h3>Výdrž</h3>
                <p>
                    Výdrž měří vaši odolnost. Vysoká výdrž znamená, že zvládnete větší fyzickou zátěž, přemůžete únavu a zůstanete odolní v náročných situacích.
                </p>

                <h3>Inteligence</h3>
                <p>
                    Inteligence odráží vaši schopnost řešit problémy a znalosti. Čím vyšší je vaše inteligence, tím lépe se učíte, rozumíte složitým informacím a přemýšlíte strategicky.
                </p>

                <h3>Moudrost</h3>
                <p>
                    Moudrost je o vhledu, introspekci a dělání správných rozhodnutí. S vysokou moudrostí jste si více vědomi svého okolí a lépe rozpoznáváte vzorce chování, což pomáhá při rozhodování.
                </p>

                <h3>Charisma</h3>
                <p>
                    Charisma měří váš společenský vliv a sympatičnost. Vyšší statistika charismatu zlepšuje vaši schopnost komunikovat, přesvědčovat a inspirovat ostatní.
                </p>

                <h2>Jak získat XP?</h2>
                <p>
                    Existují dva způsoby, jak získat zkušenostní body (XP) v XP-life: prostřednictvím denních aktivit a prostřednictvím úkolů.
                </p>

                <h3>Denní aktivity</h3>
                <p>
                    Každodenní aktivity jsou úkoly v reálném životě, do kterých se rozhodnete zapojit na základě svých zájmů a toho, jak chcete trávit čas. Tyto aktivity jsou plně přizpůsobitelné a je to jen na vás. Udělejte si chvilku na zamyšlení nad svou každodenní rutinou a koníčky a poté každou aktivitu, které se chcete věnovat nebo ve které se chcete zlepšit, přiřaďte k jedné ze 6 vlastností.
                </p>
                <p>
                    Je důležité mít na paměti, že nemusíte dělat každou aktivitu každý den. Zatímco některé činnosti mohou být každodenními úkoly, můžete také zahrnout aktivity, které děláte každý druhý den, jednou týdně nebo dokonce jednou za měsíc.
                </p>
                <p>
                    Jakmile se rozhodnete, kterým aktivitám se chcete věnovat, musíte každé aktivitě přiřadit určité množství XP podle toho, jak těžké je pro vás aktivitu dokončit. Vyberte si z následujících možností:
                </p>
                <ul>
                    <li>5 XP za snadné úkoly</li>
                    <li>10 XP za běžné úkoly</li>
                    <li>15 XP za těžké úkoly</li>
                </ul>

                <h4>Zde je několik příkladů denních aktivit pro každou z vašich statistik:</h4>
                <ul>
                    <li><strong>Síla:</strong> horolezectví, cvičení, zahradničení, běh</li>
                    <li><strong>Zručnost:</strong> hra na hudební nástroj, pletení nebo háčkování, stolní tenis</li>
                    <li><strong>Výdrž:</strong> vaření, 8 hodin spánku, zdravé stravování</li>
                    <li><strong>Inteligence:</strong> dělání domácích úkolů, sudoku nebo křížovky, šachy, učení se nového jazyka</li>
                    <li><strong>Moudrost:</strong> psaní deníku, meditace, čtení filozofie nebo seberozvojových knih</li>
                    <li><strong>Charisma:</strong> mluvení na veřejnosti nebo vyprávění příběhů, herectví nebo improvizace, pořádání setkání, setkání s přáteli na kávu</li>
                </ul>

                <h3>Úkoly</h3>
                <p>
                    Úkoly jsou dalším způsobem, jak získat XP, a jsou také založeny na aktivitách v reálném životě, na které se chcete zaměřit. Úkoly se však od denních aktivit liší v několika ohledech. Hlavním cílem denních aktivit je, abyste těmto aktivitám věnovali čas během dne. Úkoly by měly mít naopak definitivní začátek a konec. Úkoly by měly být něco, co můžete dokončit a odškrtnout si ze seznamu úkolů. Úkoly mohou souviset s vašimi každodenními aktivitami, ale mělo by být možné je dokončit.
                </p>
                <p>
                    Dokončením úkolu získáte 100 XP, takže si pečlivě vyberte, kterou aktivitu proměníte v úkol. Nechcete, aby vaše úkoly byly příliš snadné, měly by být nějakým způsobem výzvou. Ale také nechcete, aby bylo nemožné je dokončit, aby vás XP-life stále motivoval.
                </p>

                <h4>Zde je několik příkladů úkolů pro každou z vašich statistik:</h4>
                <ul>
                    <li><strong>Síla:</strong> dokončete běh na 5 km, udělejte 50 kliků v jednom tréninku, proveďte velký domácí projekt</li>
                    <li><strong>Obratnost:</strong> naučte se zahrát novou píseň na hudební nástroj, dokončete 30denní protahovací výzvu, dokončete malý šicí nebo malířský projekt</li>
                    <li><strong>Výdrž:</strong> pěší výlet po dobu 3 hodin bez přestávky, dokončete týden denního cvičení, zkraťte čas strávený u obrazovky o 50 % po dobu jednoho týdne, jezte zdravě po dobu 30 dnů</li>
                    <li><strong>Inteligence:</strong> dočtěte knihu, dokončete kurz pro začátečníky o něčem novém</li>
                    <li><strong>Moudrost:</strong> dokončete 30denní výzvu vděčnosti, den digitálního detoxu, naplánujte si den péče o sebe, vytvořte si nástěnku vizí</li>
                    <li><strong>Charisma:</strong> uspořádejte herní nebo filmový večer, předneste prezentaci nebo veřejný projev, pochvalte tři lidi v jednom dni, zúčastněte se společenské akce sami, zahajte konverzaci s cizím člověkem, rozesmějte někoho každý den po dobu jednoho týdne</li>
                </ul>

                <h2>Jak upravit denní aktivity?</h2>

                <h3>Jak přidat novou aktivitu:</h3>
                <ol>
                    <li>Přejděte na stránku svého profilu a klikněte na možnost Upravit aktivitu umístěnou pod vaším profilovým obrázkem.</li>
                    <li>V okně Přidat aktivitu, které se otevře, začněte výběrem vlastnosti, která nejlépe odpovídá této aktivitě. Můžete si vybrat kteroukoli ze 6 statistik podle povahy aktivity.</li>
                    <li>Do poskytnutého pole zadejte název své aktivity.</li>
                    <li>Volitelně můžete přidat krátký popis, který aktivitu dále vysvětlí.</li>
                    <li>Dále vyberte hodnotu XP pro tuto aktivitu ze tří nabízených možností.</li>
                    <li>Jakmile zadáte všechny podrobnosti, uložte kliknutím na Přidat aktivitu.</li>
                </ol>

                <h3>Jak zakázat aktivitu:</h3>
                <ol>
                    <li>Otevřete okno Přidat aktivitu a vyberte možnost Odebrat/zakázat aktivitu. Zobrazí se okno Spravovat aktivitu.</li>
                    <li>V okně Spravovat aktivitu přejděte v dolní části do části Vybrat akci a vyberte možnost Zakázat.</li>
                    <li>Dále vyberte kategorii obsahující aktivitu, kterou chcete zakázat.</li>
                    <li>Ze seznamu vyberte konkrétní aktivitu, kterou chcete zakázat.</li>
                    <li>Nakonec klikněte na Přijmout změnu pro uložení aktualizace.</li>
                </ol>

                <h3>Jak povolit aktivitu:</h3>
                <ol>
                    <li>Otevřete okno Přidat aktivitu a vyberte možnost Odebrat/zakázat aktivitu. Zobrazí se okno Spravovat aktivitu.</li>
                    <li>V okně Spravovat aktivitu přejděte v dolní části do části Vybrat akci a vyberte možnost Povolit.</li>
                    <li>Dále vyberte kategorii obsahující aktivitu, kterou chcete povolit.</li>
                    <li>Ze seznamu vyberte konkrétní aktivitu, kterou chcete povolit.</li>
                    <li>Nakonec klikněte na Přijmout změnu pro uložení aktualizace.</li>
                </ol>

                <h3>Jak odstranit aktivitu:</h3>
                <ol>
                    <li>V okně Spravovat aktivitu přejděte do dolní části a v kolonce Vybrat akci a vyberte možnost Odstranit.</li>
                    <li>Vyberte kategorii obsahující aktivitu, kterou chcete smazat.</li>
                    <li>Vyberte konkrétní aktivitu, kterou chcete ze seznamu odstranit.</li>
                    <li>Zobrazí se výzva s pokyny k zadání "DELETE MY [název aktivity]" pro potvrzení. Nahraďte [Název aktivity] přesným názvem vybrané aktivity.</li>
                    <li>Podle pokynů zadejte "DELETE MY [název aktivity]".</li>
                    <li>Kliknutím na tlačítko Přijmout změnu aktualizaci potvrďte a uložte.</li>
                </ol>
                <p>
                    Vezměte prosím na vědomí, že jakmile aktivitu smažete, smažou se také všechny zkušenosti, které jste z této aktivity získali!
                </p>
                <h2>Jak nastavit úkoly?</h2>

                <h3>Jak přidat úkol:</h3>
                <ol>
                    <li>Přejdi na stránku Úkoly a vyber možnost Přidat úkol.</li>
                    <li>Do určeného pole zadejte název svého úkolu.</li>
                    <li>Poskytněte stručný popis s podrobnostmi úkolu.</li>
                    <li>Vyberte kategorii, která nejlépe odpovídá statistice, ke které se váš úkol vztahuje.</li>
                    <li>Kliknutím na Přidat úkol uložíte svůj nový úkol.</li>
                </ol>

                <h3>Jak smazat úkol:</h3>
                <ol>
                    <li>Přejděte na stránku Úkoly a vyberte možnost Smazat úkol.</li>
                    <li>Vyberte úkol, který chcete ze seznamu odstranit.</li>
                    <li>Zadejte "DELETE [název úkolu]" pro potvrzení výběru.</li>
                    <li>Kliknutím na tlačítko Odstranit proces dokončete.</li>
                </ol>


            </div>
    {/if}

    </section>
</div>

<style lang="stylus">
    .info-container
        display flex
        justify-content center
        align-items flex-start
        padding 20px

    .info-box
        background-color rgba(0, 0, 0, 0.35)
        color white
        border-radius 10px
        box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
        backdrop-filter blur(10px)
        padding 40px
        margin 0 20px
        max-width 1800px
        line-height 1.6
        overflow auto


    h1, h2, h3
        color #ff8113
        margin-bottom 10px

    ul, ol
        margin-left 20px

    li
        margin-bottom 8px

    .language-switcher
        display flex
        justify-content flex-end
        gap 10px
        margin-bottom 20px

        button
            padding 10px 20px
            font-size 16px
            color white
            background-color rgba(0, 0, 0, 0.6)
            border none
            border-radius 5px
            cursor pointer
            transition background-color 0.3s ease

            &.active
                background-color #007bff

            &:hover:not(.active)
                background-color rgba(255, 255, 255, 0.2)

    </style>
