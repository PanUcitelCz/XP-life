<script lang="ts">
	//@ts-nocheck
	import { Snapgrab } from 'snapgrab';
	import { onMount } from 'svelte';

	type Activity = {
		id: number;
		points: number;
		level: number;
		activityName: string;
		lastXPAdded: string;
	};

	type Props = {
		categoryName?: string;
		activities?: Activity[];
		totalPoints?: number;
		onAddXP: (activityId: number) => void;
	};

	const { categoryName, activities = [], totalPoints, onAddXP, ...restProps }: Props = $props();

	// Reaktivní proměnná 'slider' s typem HTMLElement nebo null
	let slider = $state();

	// Funkce pro přidání XP k určité aktivitě
	const handleAddXP = (activityId: number) => {
		onAddXP(activityId);
	};

	$effect(() => {
		if (!slider) return;
		// @ts-ignore
		const snapgrab = new Snapgrab(slider, {
			autoheight: false
		});

		console.log(snapgrab);

		// Inicializace až po vykreslení wrapperu
		snapgrab.init();
	});
</script>

<div class="category-section">
	<h3>{categoryName} (Total XP: {totalPoints})</h3>

	{#if activities.length > 0}
		<div class="activity" bind:this={slider}>
			{#each activities as activity, index (activity.id)}
				<div>
					{#if index % 2 === 0}
						<!-- Každé dvě aktivity -->
						<div class="activity__wrapper" data-ref="wrapper">
							<!-- Wrapper pro skupinu aktivit -->
							<div class="activity__slide">
								<!-- První aktivita ve skupině -->
								<div class="activity-header">
									<span class="activity-name">{activities[index].activityName}</span>
									<span class="activity-level">Level: {activities[index].level}</span>
								</div>
								<p class="activity-xp">XP: {activities[index].points}</p>
								<div class="activity-actions">
									{#if activities[index].lastXPAdded && new Date(activities[index].lastXPAdded).toDateString() === new Date().toDateString()}
										<button disabled>XP already added today</button>
									{:else}
										<button onclick={() => handleAddXP(activities[index].id)}>Add XP</button>
									{/if}
								</div>
							</div>
							{#if activities[index + 1]}
								<div class="activity__slide">
									<!-- Druhá aktivita ve skupině -->
									<div class="activity-header">
										<span class="activity-name">{activities[index + 1].activityName}</span>
										<span class="activity-level">Level: {activities[index + 1].level}</span>
									</div>
									<p class="activity-xp">XP: {activities[index + 1].points}</p>
									<div class="activity-actions">
										{#if activities[index + 1].lastXPAdded && new Date(activities[index + 1].lastXPAdded).toDateString() === new Date().toDateString()}
											<button disabled>XP already added today</button>
										{:else}
											<button onclick={() => handleAddXP(activities[index + 1].id)}>Add XP</button>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{/if}
					<div class="activity__dots" data-ref="dots" aria-label="Dots"></div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="no-activities">You need to add an activity to level up</p>
	{/if}
</div>

<style lang="stylus">
    .category-section
        background rgba(0, 0, 0, 0.35)
        backdrop-filter blur(10px)
        -webkit-backdrop-filter blur(10px)
        padding 0 20px
        border-radius 10px
        box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
        width 100%
        box-sizing border-box

        h3
            color white

    .activity
        div
            position relative

        &__wrapper
            position relative
            display flex
            margin-bottom 24px
            scroll-behavior smooth
            scroll-snap-stop always
            scroll-snap-type x mandatory
            touch-action pan-x pan-y
            overflow scroll hidden
            transition height 0.4s cubic-bezier(0.19, 1, 0.22, 1)
            scrollbar-width none

            &::-webkit-scrollbar
                display none

        &__slide
            position relative
            display flex
            flex-direction column
            justify-content center
            scroll-snap-align start
            scroll-snap-stop normal
            padding 15px
            margin-right 24px
            height max-content
            min-height 200px
            min-width calc(100% - 30px)
            font-size 24px
            font-weight 500
            text-align center
            user-select none
            background-color rgba(85, 92, 108, 0.5)
            box-shadow rgba(0, 0, 0, 0.1) 0px 4px 12px
            border-radius 8px

        &__dots
            position absolute
            left 50%
            transform translate(-50%)
            display flex
            justify-content center
            gap 8px
            bottom 12px

            :global(button)
                display block
                height 8px
                width 8px
                border-radius 50%
                padding 0
                cursor pointer
                background rgba(white, 40%)
                transition background 0.6s cubic-bezier(0.19, 1, 0.22, 1)
                border none

                &:hover
                    background: rgba(0, 0, 0, 54%)

            :global(button.is-active)
                background white

    .activity-header
        display flex
        justify-content space-between
        margin-bottom 5px

    .activity-name
        font-weight bold
        text-align left
        color #ff8113

    .activity-level, .activity-xp
        font-size 1rem
        color #B4B4B8

    .activity-xp
        margin-bottom 10px
        font-size 1.1rem
        color #B4B4B8
        text-align center

    .activity-actions
        display flex
        justify-content center

    button
        padding 10px 15px
        border none
        border-radius 5px
        background-color #007bff
        color white
        cursor pointer
        transition background-color 0.3s
        width 100%
        max-width 300px

        &:disabled
            background-color #ccc
            cursor not-allowed

        &:hover:not(:disabled)
            background-color #0056b3

    .no-activities
        font-style italic
        color #666
        font-size 1rem
        padding 10px
        background-color #fff
        border-radius 5px
        box-shadow rgba(0, 0, 0, 0.05) 0px 4px 12px
        text-align center
</style>
