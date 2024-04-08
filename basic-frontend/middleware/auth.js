export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const user = await $api("/api/user");
    useCookie("userData").value = user;
  } catch (error) {
    if (error.status == 401) {
      const token = useCookie('accessToken')
      const user = useCookie("userData");
      token.value = null
      user.value = null
      console.log('logged out', useCookie('accessToken'));
      return navigateTo("/multiplayer/unauth")
    }
  }
})
