import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
export default defineNuxtPlugin(nuxtApp => {
    window.Pusher = Pusher
    const echo = new Echo({
        broadcaster: 'pusher',
        key: 'ltjdkesriqi8tpm9z3f1',
        authEndpoint: useRuntimeConfig().public.apiBaseUrl + '/broadcasting/auth',
        wsHost: '127.0.0.1',
        wsPort: "6001",
        cluster: 'mt1',
        forceTLS: false,
        auth: {
            headers: {
                'Authorization': 'Bearer ' + useCookie('accessToken').value,
                'Accept': 'application/json'
            }
        }
    })
    return {
        provide: {
            echo: echo,
        },
    };
})
