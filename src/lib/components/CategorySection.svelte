
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
    let slider = $state<HTMLElement | null>(null);

    // Funkce pro přidání XP k určité aktivitě
    const handleAddXP = (activityId: number) => {
        onAddXP(activityId);
    };

onMount(() => {
    $effect(() => {
        if (slider && slider instanceof HTMLElement && slider.querySelector('.activity-group')) {
            // @ts-ignore
            const snapgrab = new Snapgrab(slider, {
                autoplay: 5000,
                autoplayStopOnInteraction: true,
                autoheight: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: true,
            });

            // Inicializace až po vykreslení wrapperu
            snapgrab.init();
        }
    });
});

</script>

<div class="category-section" >
    <h3>{categoryName} (Total XP: {totalPoints}) </h3>

    {#if activities.length > 0}
    <div bind:this={slider}>
        <div class="activity-slider"   data-ref="wrapper">
            {#each activities as activity, index (activity.id)}
                {#if index % 2 === 0} <!-- Každé dvě aktivity -->
                    <div class="activity-group" > <!-- Wrapper pro skupinu aktivit -->
                        <div class="activity-row">
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
                            <div class="activity-row">
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
            {/each}
        </div>
    </div>
    {:else}
        <p class="no-activities">You need to add an activity to level up</p>
    {/if}
</div>

<style lang="stylus">
h3
    color white

.category-section
    background rgba(0, 0, 0, 0.35)
    backdrop-filter blur(10px)
    -webkit-backdrop-filter blur(10px)
    padding 20px
    border-radius 10px
    box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
    width 100%
    box-sizing border-box

.activity-slider
    display flex
    overflow-x auto
    scroll-snap-type x mandatory
    gap 15px
    justify-content flex-start

.activity-group
    display flex
    justify-content center
    flex: 0 0 100%
    gap 15px
    flex-direction column
    width 100%

.activity-row
    display flex
    flex-direction column
    background-color rgba(85, 92, 108, 0.5)
    padding 15px
    border-radius 8px
    box-shadow rgba(0, 0, 0, 0.1) 0px 4px 12px
    text-align center
    box-sizing border-box
    //margin 10px

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

button:disabled
    background-color #ccc
    cursor not-allowed

button:hover:not(:disabled)
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
