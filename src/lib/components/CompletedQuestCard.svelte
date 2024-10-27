<script lang="ts">
    // Definice typů pro props
    type CompletedQuestProps = {
      title: string;
      category: string;
      description: string;
      createdAt: string;
      completedAt: string;
    };

    let { title, category, description, createdAt, completedAt }: CompletedQuestProps = $props();

    // Formátování data na dd.mm.yyyy
    function formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  </script>

  <div class="completed-quest-card">
    <div class="completed-quest-card-header">
      <h3>{title}</h3>
      <p>{category}</p>
    </div>
    <div class="completed-quest-card-content">
      <h4>Popis</h4>
      <p>{description}</p>
    </div>
    <div class="completed-quest-card-footer">
      <p>{formatDate(createdAt)}</p>
      <p>{formatDate(completedAt)}</p>
    </div>
  </div>

  <style lang="stylus">
    .completed-quest-card
      background-color rgba(85,92,108,0.5)
      padding 15px
      border-radius 8px
      box-shadow 0 2px 5px rgba(0, 0, 0, 0.1)
      display flex
      flex-direction column
      gap 10px
      text-align center
      max-width 300px
      width 100%

      &-header
        display flex
        justify-content space-between
        align-items center
        gap 36px

        h3
          color #ff8113
          margin 0
          font-size 21px

        p
          color #b4b4b8

      &-content
        h4
          margin 0
          font-weight 500
        p
          color white

      &-footer
        display flex
        justify-content space-between
        align-items center
        color #b4b4b8
</style>
