<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import AddActivityModal from '$lib/components/AddActivityModal.svelte';
	import CategorySection from '$lib/components/CategorySection.svelte';
    import Header from '$lib/components/Header.svelte';

	const { data } = $props();
	const user = data.props?.user;

	let categories = $state<
		{
			activityName: string;
			level: number;
			points: number;
			category: string;
			id: number;
			isActive: number; // Přidán sloupec pro kontrolu aktivního stavu
			lastXPAdded: string;
		}[]
	>([]);

	let showActivityModal = $state(false);
	let selectedCategory = $state<string | null>(null);

	let strengthTotalPoints = $state(0);
	let dexterityTotalPoints = $state(0);
	let constitutionTotalPoints = $state(0);
	let intelligenceTotalPoints = $state(0);
	let wisdomTotalPoints = $state(0);
	let charismaTotalPoints = $state(0);

	async function fetchCategories() {
		const response = await fetch('/api/get-user-categories');
		if (response.ok) {
			const categoriesData = await response.json();
			categories = categoriesData;

			// Zahrnout všechny aktivity do počtu XP, ale zobrazit pouze aktivní
			strengthTotalPoints = categories.filter((a) => a.category === 'Strength').reduce((total, activity) => total + activity.points, 0);
			dexterityTotalPoints = categories.filter((a) => a.category === 'Dexterity').reduce((total, activity) => total + activity.points, 0);
			constitutionTotalPoints = categories.filter((a) => a.category === 'Constitution').reduce((total, activity) => total + activity.points, 0);
			intelligenceTotalPoints = categories.filter((a) => a.category === 'Intelligence').reduce((total, activity) => total + activity.points, 0);
			wisdomTotalPoints = categories.filter((a) => a.category === 'Wisdom').reduce((total, activity) => total + activity.points, 0);
			charismaTotalPoints = categories.filter((a) => a.category === 'Charisma').reduce((total, activity) => total + activity.points, 0);
		} else {
			console.error('Failed to fetch categories');
		}
	}

	onMount(fetchCategories);

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

	function showAddActivityModal(category: string) {
		if (category) {
			selectedCategory = category;
			showActivityModal = true;
		}
	}

	function closeModal() {
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
			fetchCategories(); // Aktualizuj kategorie po úspěšném přidání XP
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

	function getLevelData(categoryName: String) {
		const totalPoints = getTotalPoints(categoryName);
		return calculateLevel(totalPoints);
	}
</script>

<svelte:head>
	<title>XP Life - Profile</title>
</svelte:head>

<Header />

{#if user}
	<div class="hero">
		<section class="profile-section">
            <div class="profile-section-header">
                <a href="/profile/settings" class="small_button"><i class="icon icon-settings"></i></a>
                <h1>{user.nickname}</h1>
                <button onclick={logout} class="logout"><i class="icon icon-logout"></i></button>
            </div>
			<div class="profile-section-img">
                <img src="https://preview.redd.it/new-lore-ekko-or-old-lore-ekko-v0-rk1pnlymql5c1.jpg?width=300&format=pjpg&auto=webp&s=769e3a4b5537853cea944cfb4ccf350320975d18" alt="Profilcture" />
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
						<h3>{categoryName} (Level {getLevelData(categoryName).level})</h3>
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
{:else}
	<p>You are not logged in.</p>
{/if}

<style lang="stylus">
  .hero
    display grid
    grid-template-columns 1fr 3fr // První potomek zabere 1fr, zbytek 4fr
    grid-gap 24px
    margin-bottom 20px
    padding 0 36px
    min-height 400px
    box-sizing border-box
    margin-top 36px
    margin-bottom 72px

    @media (max-width: 1200px) // Na mobilu bude profil nahoře a ostatní sekce pod sebou
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

        img
            width 150px
            height 150px
            border-radius 50%
            object-fit cover
            margin-bottom 20px

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


</style>
