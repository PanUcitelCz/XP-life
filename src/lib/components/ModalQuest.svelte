<script lang="ts">
    type Props = {
      questTitle: string;
      showModal: boolean;
      onConfirm: () => void;
    };

    let { questTitle, showModal, onConfirm }: Props = $props();

    const confirmCompletion = () => {
      onConfirm();
      showModal = false;
    };
  </script>

  {#if showModal}
    <div class="modal-overlay">
      <div class="modal">
        <h2>Complete Quest</h2>
        <p>Are you sure you want to complete the quest <strong>{questTitle}</strong>?</p>
        <div class="button-group">
          <button class="confirm-button" onclick={confirmCompletion}>Yes</button>
          <button class="cancel-button" onclick={() => (showModal = false)}>No</button>
        </div>
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
      background rgba(0, 0, 0, 0.6)

    .modal
      background-color white
      padding 25px
      border-radius 10px
      width 320px
      max-width 90%
      text-align center
      box-shadow 0 4px 12px rgba(0, 0, 0, 0.2)

      h2
        color #333
        margin-bottom 10px

      p
        color #555
        margin 20px 0
        line-height 1.5

      .button-group
        display flex
        justify-content space-between
        gap 15px

      .confirm-button
        background-color #007bff
        color white
        padding 10px 20px
        border none
        border-radius 5px
        cursor pointer
        transition background-color 0.3s

        &:hover
          background-color #0056b3

      .cancel-button
        background-color #ddd
        color #333
        padding 10px 20px
        border none
        border-radius 5px
        cursor pointer
        transition background-color 0.3s

        &:hover
          background-color #bbb
  </style>
