<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import AddActivityModal from '$lib/components/AddActivityModal.svelte';
	import CategorySection from '$lib/components/CategorySection.svelte';
	import Modalimg from '$lib/components/Modalimg.svelte';

	const { data } = $props();
	const user = data.props?.user;
    const completedQuests = data.props?.completedQuests ?? [];

    if (Array.isArray(completedQuests)) {
        console.log("Loaded completed quests:", completedQuests);
    } else {
        console.error("Completed quests is not an array:", completedQuests);
    }

	// Definuj typ pro dokončený quest
	type CompletedQuest = {
		category: string;
		xp_value: number;
	};

	let categories = $state<
		{
			activityName: string;
			level: number;
			points: number;
			category: string;
			id: number;
			isActive: number;
			lastXPAdded: string;
		}[]
	>([]);

	let showActivityModal = $state(false);
	let selectedCategory = $state<string | null>(null);
	let showImageModal = $state(false);

	let strengthTotalPoints = $state(0);
	let dexterityTotalPoints = $state(0);
	let constitutionTotalPoints = $state(0);
	let intelligenceTotalPoints = $state(0);
	let wisdomTotalPoints = $state(0);
	let charismaTotalPoints = $state(0);

    let questXPByCategory = {
  Strength: 0,
  Dexterity: 0,
  Constitution: 0,
  Intelligence: 0,
  Wisdom: 0,
  Charisma: 0
};

async function fetchCategories() {
	const response = await fetch('/api/get-user-categories');
	const completedQuestsResponse = await fetch('/api/get-completed-quests');

	if (response.ok && completedQuestsResponse.ok) {
		const categoriesData = await response.json();
		const { completedQuests } = await completedQuestsResponse.json();

		categories = categoriesData;

		// Uložíme XP z questů do proměnné questXPByCategory
		if (Array.isArray(completedQuests)) {
			console.log("Loaded completed quests:", completedQuests);
			questXPByCategory = completedQuests.reduce((acc, quest) => {
				if (quest.category && quest.xpValue) {
					acc[quest.category] = (acc[quest.category] || 0) + quest.xpValue;
				}
				return acc;
			}, {
				Strength: 0,
				Dexterity: 0,
				Constitution: 0,
				Intelligence: 0,
				Wisdom: 0,
				Charisma: 0
			});

			console.log("XP from completed quests by category:", questXPByCategory);
		} else {
			console.error("Completed quests is not an array:", completedQuests);
		}

		// Zahrnutí aktivit do celkového počtu XP (s připočítáním quest XP)
		strengthTotalPoints = categories.filter((a) => a.category === 'Strength').reduce((total, activity) => total + activity.points, questXPByCategory.Strength);
		dexterityTotalPoints = categories.filter((a) => a.category === 'Dexterity').reduce((total, activity) => total + activity.points, questXPByCategory.Dexterity);
		constitutionTotalPoints = categories.filter((a) => a.category === 'Constitution').reduce((total, activity) => total + activity.points, questXPByCategory.Constitution);
		intelligenceTotalPoints = categories.filter((a) => a.category === 'Intelligence').reduce((total, activity) => total + activity.points, questXPByCategory.Intelligence);
		wisdomTotalPoints = categories.filter((a) => a.category === 'Wisdom').reduce((total, activity) => total + activity.points, questXPByCategory.Wisdom);
		charismaTotalPoints = categories.filter((a) => a.category === 'Charisma').reduce((total, activity) => total + activity.points, questXPByCategory.Charisma);
	} else {
		console.error('Failed to fetch categories or completed quests');
	}
}

	onMount(fetchCategories);

	// Zbytek kódu beze změn
	async function logout() {
		const response = await fetch('/logout', { method: 'POST' });
		if (response.ok) {
			setTimeout(() => {
				goto('/login');
			}, 1000);
		} else {
			alert('Logout failed');
		}
	}

	async function showAddActivityModal(category: string) {
		if (category) {
			selectedCategory = category;
			showActivityModal = true;
		}
	}

	async function closeModal() {
		showActivityModal = false;
		selectedCategory = null;
		fetchCategories();
	}

	async function addXP(activityId: number, category: string) {
		const activity = categories.find((a) => a.id === activityId && a.category === category);
		if (!activity) {
			console.error('Activity not found');
			return;
		}

		let apiUrl = '';
		switch (category) {
			case 'Strength':
				apiUrl = '/api/add-xp-strength';
				break;
			case 'Dexterity':
				apiUrl = '/api/add-xp-dexterity';
				break;
			case 'Constitution':
				apiUrl = '/api/add-xp-constitution';
				break;
			case 'Intelligence':
				apiUrl = '/api/add-xp-intelligence';
				break;
			case 'Wisdom':
				apiUrl = '/api/add-xp-wisdom';
				break;
			case 'Charisma':
				apiUrl = '/api/add-xp-charisma';
				break;
			default:
				console.error('Invalid category');
				return;
		}

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ activityId, category })
		});

		if (response.ok) {
			fetchCategories();
		} else {
			console.error('Failed to add XP');
		}
	}

	function calculateLevel(points: number) {
		let level = 1;
		let threshold = 50;
		while (points >= threshold) {
			points -= threshold;
			level++;
			threshold += 25;
		}
		return { level, remainingXP: points, nextLevelXP: threshold };
	}

	function getTotalPoints(categoryName: String) {
		return categories.filter((c) => c.category === categoryName).reduce((acc, activity) => acc + activity.points, 0);
	}

    function getLevelData(categoryName: string) {
        let totalPoints = getTotalPoints(categoryName) + (questXPByCategory[categoryName as keyof typeof questXPByCategory] || 0);
        return calculateLevel(totalPoints);
    }


    function openImageModal() {
        showImageModal = true;
    }


	function closeImageModal() {
		showImageModal = false;
	}
</script>

<svelte:head>
	<title>XP Life - Profile</title>
</svelte:head>

{#if user}
	<div class="hero">
		<section class="profile-section">
            <div class="profile-section-header">
                <a href="/profile/settings" class="small_button"><i class="icon icon-settings"></i></a>
                <h1>{user.nickname}</h1>
                <button onclick={logout} class="logout"><i class="icon icon-logout"></i></button>
            </div>
			<div class="profile-section-img">
                <button class="clickable" onclick={openImageModal} aria-label="Change profile picture" id="profile_img">
                    <img src={user.profileImage} alt="" />
                </button>
                <div>
                    <i class="icon icon-level"></i>
                    <div>
                        {user.userLevel}
                    </div>
                </div>
            </div>
			<button onclick={() => showAddActivityModal('Strength')}>Edit activity</button>
		</section>

		<!-- Střední část - Kategorie a postup levelů -->
		<section class="levels">
			{#each ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'] as categoryName}
				{#key categoryName}
					<div class="category-tile">
						<h3>{categoryName}
                            <div>
                                <i class="icon icon-level-border"></i>
                                <div>
                                    {getLevelData(categoryName).level}
                                </div>
                            </div>
                        </h3>
						<div class="progress-bar">
							<div class="progress" style="width: {(getLevelData(categoryName).remainingXP / getLevelData(categoryName).nextLevelXP) * 100}%"></div>
						</div>
						<p>
							{getLevelData(categoryName).remainingXP} / {getLevelData(categoryName).nextLevelXP} XP to next level
						</p>
					</div>
				{/key}
			{/each}
		</section>
	</div>
	<section class="activities">
		<CategorySection
			categoryName="Strength"
			activities={categories.filter((a) => a.category === 'Strength' && a.isActive === 1)}
			totalPoints={strengthTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Strength')}
		/>

		<CategorySection
			categoryName="Dexterity"
			activities={categories.filter((a) => a.category === 'Dexterity' && a.isActive === 1)}
			totalPoints={dexterityTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Dexterity')}
		/>

		<CategorySection
			categoryName="Constitution"
			activities={categories.filter((a) => a.category === 'Constitution' && a.isActive === 1)}
			totalPoints={constitutionTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Constitution')}
		/>

		<CategorySection
			categoryName="Intelligence"
			activities={categories.filter((a) => a.category === 'Intelligence' && a.isActive === 1)}
			totalPoints={intelligenceTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Intelligence')}
		/>

		<CategorySection
			categoryName="Wisdom"
			activities={categories.filter((a) => a.category === 'Wisdom' && a.isActive === 1)}
			totalPoints={wisdomTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Wisdom')}
		/>

		<CategorySection
			categoryName="Charisma"
			activities={categories.filter((a) => a.category === 'Charisma' && a.isActive === 1)}
			totalPoints={charismaTotalPoints}
			onAddXP={(activityId: number) => addXP(activityId, 'Charisma')}
		/>
	</section>
	<section class="buttons">
		{#if showActivityModal && selectedCategory !== null}
        	<AddActivityModal userId={user.id} category={selectedCategory} {closeModal} />
		{/if}
	</section>
	<!-- Modální okno pro změnu profilového obrázku -->
    {#if showImageModal}
    <Modalimg
        on:confirm={() => {
            closeImageModal(); // Zavřít modal
            fetchCategories(); // Aktualizace dat
        }}
        on:cancel={closeImageModal}
    />
    {/if}


{:else}
	<p>You are not logged in.</p>
{/if}

<style lang="stylus">
  .hero
    display grid
    grid-template-columns 1fr 3fr
    grid-gap 24px
    margin-bottom 20px
    padding 0 36px
    min-height 400px
    box-sizing border-box
    margin-bottom 72px

    @media (max-width: 1200px)
      display flex
      justify-content center
      align-items center
      flex-direction column

  .profile-section
    display flex
    gap 8px
    flex-direction column
    justify-content space-between
    align-items center
    background-color rgba(0, 0, 0, 0.35)
    padding 20px
    border-radius 10px
    box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
    width 100%
    text-align center
    box-sizing border-box
    backdrop-filter: blur(10px)
    color white

    &-header
        display flex
        justify-content space-between
        width 100%

    & > div
        display flex
        align-items center
        gap 8px

        i
            font-size 24px
            display flex

        & > div
            display flex
            align-items center
            font-weight 500
            gap 8px

    button
        background #007bff
        border none
        color white
        border-radius 10px
        padding 10px
        max-width 300px
        width 100%
        height 3rem
        transition background .6s $easeOutExpo
        cursor pointer
        margin-top 24px
        font-size 18px

        +hover()
            &:hover
                text-decoration-color transparent
                background #2a40ae

    a
        width 48px
        background #495464
        transition background .6s $easeOutExpo, color .6s $easeOutExpo
        color white
        text-decoration none
        display flex
        justify-content center
        align-items center
        gap 8px
        height 48px
        border-radius 8px

        +hover()
            &:hover
                text-decoration-color transparent
                background white
                color black

    .logout
        background #495464
        transition background .6s $easeOutExpo, color .6s $easeOutExpo
        display flex
        justify-content center
        align-items center
        gap 8px
        width 48px
        margin 0

        +hover()
            &:hover
                text-decoration-color transparent
                background white
                color black

    @media (max-width: 768px)
      width 100%
      max-width 100%

    &-img
        position relative

        #profile_img
            background none
            width inset
            height 100%
            margin 0

        img
            width 150px
            height 150px
            border-radius 50%
            object-fit cover
            margin-bottom 20px
            cursor pointer

        div
            position absolute
            right 0
            bottom 24px
            width 47px
            height 46px

            i
                font-size 50px
                color #007bff
                position absolute
                text-align center

            div
                z-index 10
                display flex
                justify-content center
                align-items center
                width 48px
                height 48px
                position absolute
                bottom 0

  .levels
    display grid
    width 100%
    grid-template-columns repeat(auto-fit, minmax(400px, 1fr))
    gap 24px

    @media (max-width: 768px)
        display flex
        justify-content center
        align-items center
        flex-direction column

    .category-tile
      background rgba(0, 0, 0, 0.35)
      padding 20px
      border-radius 10px
      box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
      text-align center
      display flex
      flex-direction column
      justify-content center
      align-items center
      box-sizing border-box
      backdrop-filter blur(10px)
      color white

      h3
        margin 0 0 12px
        color white
        display flex
        justify-content center
        align-items center
        gap 10px

        div
            position relative
            width 40px
            height 40px

            i
                font-size 40px
                position absolute
                color #007bff
                left 0

            div
                position absolute
                left -2px
                height 100%
                display flex
                justify-content center
                align-items center
                font-weight 500

      p
        color #b4b4b8

      @media (max-width: 768px)
        width 100%

      .progress-bar
        width 100%
        height 10px
        background-color #e0e0e0
        border-radius 5px
        overflow hidden
        .progress
          height 100%
          background-color #ff8113
          transition width 0.3s

  .activities
    display flex
    flex-direction row
    flex-wrap wrap
    width 100%
    padding 0 36px
    margin 0
    box-sizing border-box
    display grid
    grid-template-columns repeat(auto-fit, minmax(400px, 1fr))
    gap 24px
    margin-bottom 36px

    @media (max-width: 768px)
      width 100%
      display flex
      justify-content center
      align-items center
      flex-direction column

  .clickable {
    cursor: pointer;
    transition: filter 0.3s ease;
  }

  .clickable:hover {
    filter: blur(10px);
  }
</style>
