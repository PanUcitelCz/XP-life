<script lang="ts">
    type Props = {
      questTitle: string;
      showModal: boolean;
      onConfirm: () => void;
    };

    // Správné předávání props s definovanými typy
    let { questTitle, showModal, onConfirm }: Props = $props();

    // Funkce pro potvrzení dokončení questu
    const confirmCompletion = () => {
      onConfirm(); // Potvrzení
      showModal = false; // Zavře modal
    };
  </script>

  {#if showModal}
    <div class="modal-overlay">
      <div class="modal">
        <h2>Complete Quest</h2>
        <p>Are you sure you want to complete the quest <strong>{questTitle}</strong>?</p>
        <button onclick={confirmCompletion}>Yes</button>
        <button onclick={() => showModal = false}>No</button>
      </div>
    </div>
  {/if}

  <style lang="stylus">
    .modal-overlay
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      display flex
      justify-content center
      align-items center
      background rgba(0, 0, 0, 0.5)

    .modal
      background-color white
      padding 20px
      border-radius 10px
      width 300px
      text-align center

    button
      margin 10px
      padding 10px
      cursor pointer
  </style>
