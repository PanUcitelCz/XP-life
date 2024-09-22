<script lang="ts">
    import Button from '$lib/components/Button.svelte';
</script>

  <svelte:head>
    <title>Verification Successful</title>
  </svelte:head>

  <div class="verify-container">
    <div class="verify-box">
      <h1>Email Verified Successfully!</h1>
      <p>Your email has been successfully verified. You can now log in.</p>
      <Button href="/login" color="grey">Back to login</Button>
    </div>
  </div>

  <style lang="stylus">
    .verify-container
        display: flex
        justify-content: center
        align-items: center
        height: 100vh

    .verify-box
        background-color: white
        padding: 40px
        border-radius: 10px
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1)
        text-align: center;
        background-color rgba(0, 0, 0, 0.35)
        border-radius 10px
        box-shadow rgba(17, 12, 46, 0.15) 0px 48px 100px 0px

    h1
        color: #ff8113
        margin-bottom: 20px

    p
        margin-bottom: 30px
        font-size: 18px
        color white

</style>
