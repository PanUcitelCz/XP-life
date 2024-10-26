<script lang="ts">
    // Definice typů pro props
    type Activity = {
      id: number;
      title: string;
      description: string;
      category: string;
      createdAt: string;
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
  </script>

  <div class="quest-card">
    <h3>{activity.title}</h3>
    <p><strong>Category:</strong> {activity.category}</p>
    <p><strong>Description:</strong> {activity.description}</p>
    <p><strong>Created At:</strong> {activity.createdAt}</p>
    <button onclick={handleAddXP}>Add XP</button>
  </div>

  <style lang="stylus">
    .quest-card
      background-color #f0f0f0
      padding 15px
      border-radius 8px
      box-shadow 0 2px 5px rgba(0, 0, 0, 0.1)
      display flex
      flex-direction column
      gap 10px
      text-align center

    button
      background-color #007bff
      color white
      padding 10px
      border none
      border-radius 5px
      cursor pointer

    button:hover
      background-color #0056b3
  </style>
