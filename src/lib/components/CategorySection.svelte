<script lang="ts">
	export let categoryName: string;
	export let activities: {
		activityName: string;
		level: number;
		points: number;
		id: number;
		lastXPAdded: string;
	}[] = [];
	export let totalPoints: number;
	export let onAddXP: (activityId: number) => void;

    let currentPage = 0;
    const itemsPerPage = 2;

    // Derivace totalPages, aby se automaticky aktualizoval při změně activities
    $: totalPages = Math.ceil(activities.length / itemsPerPage);

    // Získání aktivit na aktuální stránce
    function getCurrentActivities() {
        const start = currentPage * itemsPerPage;
        const end = start + itemsPerPage;
        return activities.slice(start, end);
    }

    // Přepínání na další stránku
    function nextPage() {
        if (currentPage < totalPages - 1) {
            currentPage++;
        }
    }

    // Přepínání na předchozí stránku
    function prevPage() {
        if (currentPage > 0) {
            currentPage--;
        }
    }

    // Posun myší (scroll nebo touch gesture)
    function handleWheel(event: WheelEvent) {
        if (event.deltaY > 0) {
            nextPage();
        } else if (event.deltaY < 0) {
            prevPage();
        }
    }

    // Detekce swipe gesture (prstem)
    let startX: number;
    function handleTouchStart(event: TouchEvent) {
        startX = event.touches[0].clientX;
    }

    function handleTouchMove(event: TouchEvent) {
        const touchX = event.touches[0].clientX;
        if (startX - touchX > 50) {  // posun vlevo
            nextPage();
        } else if (startX - touchX < -50) {  // posun vpravo
            prevPage();
        }
    }
</script>

<div class="category-section" onwheel={handleWheel} ontouchstart={handleTouchStart} ontouchmove={handleTouchMove}>
	<h3>{categoryName} (Total XP: {totalPoints})</h3>

	{#if activities.length > 0}
        <div class="activity-list-wrapper">
            <div class="activity-list">
                {#each getCurrentActivities() as activity}
                    <div class="activity-row">
                        <div class="activity-header">
                            <span class="activity-name">{activity.activityName}</span>
                            <span class="activity-level">Level: {activity.level}</span>
                        </div>
                        <p class="activity-xp">XP: {activity.points}</p>
                        <div class="activity-actions">
                            {#if activity.lastXPAdded && new Date(activity.lastXPAdded).toDateString() === new Date().toDateString()}
                                <button disabled>XP already added today</button>
                            {:else}
                                <button onclick={() => onAddXP(activity.id)}>Add XP</button>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <p class="no-activities">You need to add an activity to level up</p>
    {/if}

    <!-- Ukazatele (tečky) -->
    {#if totalPages > 0}
        <div class="pointers">
            {#each Array(totalPages) as _, index}
                <button
                    class="dot {currentPage === index ? 'active' : ''}"
                    onclick={() => currentPage = index}
                    aria-label="Go to page {index + 1}">
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="stylus">
    h3
    color white
    margin: 0
    margin-bottom: 21px
    text-align: center

.category-section
    background rgba(0, 0, 0, 0.35)
    backdrop-filter blur(10px)
    -webkit-backdrop-filter blur(10px)
    padding 20px
    border-radius 10px
    box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px
    width 100%
    box-sizing border-box
    position relative
    overflow hidden

.activity-list-wrapper
    overflow hidden
    width 100%
    position relative

.activity-list
    display flex
    transition transform 0.5s ease-in-out
    transform translateX(calc(-currentPage * 100%))

.activity-row
    flex 0 0 100%  /* Každý div bude mít šířku 100% */
    max-width 100%  /* Ujistíme se, že každý div zabírá celou šířku rodiče */
    display flex
    flex-direction column
    background-color rgba(85, 92, 108, 0.5)
    padding 15px
    border-radius 8px
    box-shadow rgba(0, 0, 0, 0.1) 0px 4px 12px
    text-align center
    margin: 0 15px  /* mezera mezi aktivitami */

.activity-header
    display flex
    justify-content space-between
    margin-bottom 5px

.activity-name
    font-weight: bold
    text-align: left
    color #ff8113

.activity-level,
.activity-xp
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

.pointers
    display flex
    justify-content center
    margin-top 20px
    gap 10px
    position absolute
    bottom 10px
    left 50%
    transform: translateX(-50%)

.dot
    height 10px
    width 10px
    padding 0
    margin: 0
    background-color rgba(255, 255, 255, 0.5)
    border-radius 50%
    border none
    cursor pointer
    transition background-color 0.3s

.dot.active
    background-color #ff8113
</style>
