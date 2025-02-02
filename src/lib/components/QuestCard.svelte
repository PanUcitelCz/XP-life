<script lang="ts">
    // Definice typů pro props
    type Activity = {
      id: number;
      title: string;
      description: string;
      category: string;
      createdAt: string;
      xpValue: number; // Přidána vlastnost xpValue načtená z DB
    };

    type Props = {
      activity: Activity;
      onAddXP: (activityId: number) => void;
    };

    // Přijetí props s typováním
    let { activity, onAddXP }: Props = $props();

    // Funkce pro přidání XP
    const handleAddXP = () => {
      onAddXP(activity.id);
    };

    // Formátování createdAt na datum ve formátu dd.mm.yyyy
    const formattedDate = new Date(activity.createdAt).toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  </script>

  <div class="quest-card">
    <div class="quest-card-header">
      <h3>{activity.title}</h3>
      <p>{activity.category}</p>
    </div>
    <div class="quest-card-content">
      <p>{activity.description}</p>
    </div>
    <div class="quest-card-footer">
      <p>Created At: {formattedDate}</p>
      <!-- Tlačítko nyní vypisuje hodnotu XP z DB -->
      <button onclick={handleAddXP}>Add {activity.xpValue} XP</button>
    </div>
  </div>

  <style lang="stylus">
    h3
      color #ff8113
      margin 0
      font-size 21px
      text-align left

    p
      margin 0

    .quest-card
      background-color rgba(85,92,108,0.5)
      padding 18px 24px 24px 24px
      border-radius 8px
      box-shadow 0 2px 5px rgba(0, 0, 0, 0.1)
      display flex
      flex-direction column
      gap 20px
      text-align center
      justify-content center
      max-width 300px
      width 100%

      &-header
        display flex
        justify-content space-between
        align-items center
        gap 36px

        p
          color #b4b4b8

      &-content
        p
          text-align left

      &-footer
        display flex
        justify-content center
        align-items center
        flex-direction column
        gap 10px

        p
          color #b4b4b8
          font-size 10px

        button
          background-color #007bff
          color white
          padding 10px
          border none
          border-radius 5px
          cursor pointer
          width 200px

          &:hover
            background-color #0056b3
  </style>
