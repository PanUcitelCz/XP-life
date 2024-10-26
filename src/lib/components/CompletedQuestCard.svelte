<script lang="ts">
    let { title, category, description, createdAt, completedAt } = $props<{
      title: string;
      category: string;
      description: string;
      createdAt: string;
      completedAt: string;
    }>();

    // Formátování data
    function formatDate(dateString: string): string {
      const date = new Date(dateString);
      return date.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  </script>

  <div class="completed-quest-card">
    <h3>{title}</h3>
    <p><strong>Kategorie:</strong> {category}</p>
    <p><strong>Popis:</strong> {description}</p>
    <p><strong>Datum vytvoření:</strong> {formatDate(createdAt)}</p>
    <p><strong>Datum splnění:</strong> {formatDate(completedAt)}</p>
  </div>

  <style lang="stylus">
    .completed-quest-card
      padding 16px
      border-radius 8px
      background-color #f3f3f3
      box-shadow 0 4px 6px rgba(0, 0, 0, 0.1)
      margin-bottom 16px

    h3
      margin 0 0 8px
      font-size 1.2rem

    p
      margin 4px 0
      color #555
  </style>
