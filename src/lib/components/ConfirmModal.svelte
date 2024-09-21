<script lang="ts">
	// Typování props
	type Props = {
		onConfirm: () => void;
		onCancel: () => void;
		message: string;
		confirmText: string;
	};

	// Použití $props pro přístup k parametrům
	const { onConfirm, onCancel, message, confirmText }: Props = $props();

	// Reaktivní proměnná pro text vstupu
	let inputText = $state('');

	// Funkce pro potvrzení akce
	function handleConfirm() {
		if (inputText === confirmText) {
			onConfirm();
		}
	}
</script>

<!-- Struktura modalu -->
<div class="modal-backdrop" role="dialog">
	<div class="modal">
		<h3>Confirm Action</h3>
		<p>{message}</p>
		<input type="text" bind:value={inputText} placeholder="Type here to confirm" />
		<div class="modal-buttons">
			<button onclick={handleConfirm}>Confirm</button>
			<button onclick={onCancel}>Cancel</button>
		</div>
	</div>
</div>

<style lang="stylus">
    .modal-backdrop
        position: fixed
        top: 0
        left: 0
        width: 100vw
        height: 100vh
        background: rgba(0, 0, 0, 0.5)
        display: flex
        justify-content: center
        align-items: center
        z-index: 9999

	.modal
		background: white
		padding: 20px
		border-radius: 10px
		max-width 500px
		text-align: center

	.modal-buttons
		display: flex
		gap 36px
		margin-top: 20px

	input
        width 100%
        height 40px
        border-radius 10px
        border 0px
        background #f6f5f5
        text-align center
        font-size 21px

	button
        padding 10px
        border-radius 10px
        text-decoration none
        font-size 23px
        width 100%
        text-align center
        transition background $easeOutExpo .6s, color $easeOutExpo .6s
        font-weight 500
        background #ff4c4c
        color white
        border none
        cursor pointer

        &:hover
            background #495464

        &:last-child
            color white
            background #495464

            &:hover
                background #3cab52
</style>
