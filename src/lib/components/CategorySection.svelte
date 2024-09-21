<script lang="ts">
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


	// Funkce pro přidání XP k určité aktivitě
	const handleAddXP = (activityId: number) => {
		onAddXP(activityId);
	};

</script>

<div class="category-section">
	<h3>{categoryName} (Total XP: {totalPoints})</h3>

	{#if activities.length > 0}
		<div class="activity">
			{#each activities as activity, index (activity.id)}
				<div>
					<div class="activity-slide">
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
            font-size 25px
            text-align center

    .activity
        position relative
        display flex
        flex-direction column
        //justify-content center
        height 100%
        gap 21px
        min-height 200px
        padding 21px 0
        max-height 325px  // Nastavení maximální výšky
        overflow-y auto   // Přidání svislého scrollu

        &-slide
            position relative
            display flex
            flex-direction column
            justify-content center
            padding 15px
            //min-height 200px
            //min-width calc(100% - 30px)
            font-size 21px
            font-weight 500
            text-align center
            user-select none
            background-color rgba(85, 92, 108, 0.5)
            box-shadow rgba(0, 0, 0, 0.1) 0px 4px 12px
            border-radius 8px

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
