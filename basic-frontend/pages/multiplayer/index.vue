<template>
    <div class="bg-gray-300 flex  justify-center items-center h-screen">
        <div class="bg-white p-4 rounded-lg shadow-md w-[30rem] divide-y-2 divide-dashed">
            <div class="">
                <form @submit.prevent="joinRoom" class="px-8 pt-6  mb-4">
                    <h4 class="block text-gray-700 text-lg font-bold mb-2 text-center">Join or Create Room</h4>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="room_id">
                            Room ID
                        </label>
                        <input v-model="roomId"
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="room_id" type="text" placeholder="Room ID">
                    </div>
                    <div class="flex items-center justify-between">

                        <button @click="createRoom()" type="button"
                            class=" px-4 py-2 bg-cyan-400 rounded text-white flex gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m6 0h6m-3-3v6" />
                            </svg>
                            Create
                        </button>
                        <button type="submit" class=" px-4 py-2 bg-green-400 rounded text-white flex gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 16 16">
                                <path fill="currentColor"
                                    d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm6.56 4.5h5.69a.75.75 0 0 1 0 1.5H8.56l1.97 1.97a.749.749 0 0 1-.326 1.275a.749.749 0 0 1-.734-.215L6.22 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.749.749 0 0 1 1.275.326a.749.749 0 0 1-.215.734Z" />
                            </svg>
                            Join
                        </button>
                    </div>


                </form>
            </div>
            <div class="bg-white p-4 rounded-lg ">
                <h4 class="text-center mb-4">Your Rooms</h4>
                <div class="max-h-[10rem] overflow-y-auto">
                    <div v-for="room, i in rooms"
                        class=" flex bg-gray-100 justify-between rounded-md overflow-hidden my-2">
                        <div @click="setRoonmId(room.room_code)" class=" flex items-center select-none">

                            <button class="m-1  text-gray-700 leading-5 	">
                                {{ i + 1 }}. <small class=" underline">{{ room.room_code }}</small>
                            </button>
                        </div>
                    </div>
                    <span class="flex justify-center " v-if="loading">
                        <MiscLoading />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: "auth",
});

const roomStore = useRoomStore();
const roomId = ref();
const router = useRouter()
const loading = ref(true);
const rooms = ref([]);

onMounted(async () => {
    try {
        loading.value = true;
        const res = await $api("/api/room/list", {
            method: "GET",
            onResponseError({ response }) {
                alert('error')
            },
        });
        console.log('rooms >>>', res);
        rooms.value = res.rooms

    } catch (error) {
        console.log("Error res >>>", error)
    }
    finally {
        loading.value = false
    }

});




const setRoonmId = (id) => {
    roomId.value = id
}

const createRoom = async () => {
    try {
        const res = await $api("/api/room/create", {
            method: "POST",
            onResponseError({ response }) {
                alert('error')
            },
        });

        console.log("response >>>", res);
        roomStore.roomData = res.room
        nextTick(async () => {
            await goto('/multiplayer/room')
        })
    } catch (error) {
        console.log("Error res >>>", error)
    }
    finally {
    }
}


const joinRoom = async () => {
    if (!roomId.value) {
        alert('no id')
        return;
    }
    try {
        const res = await $api("/api/room/join", {
            method: "POST",
            body: {
                room_id: roomId.value,
            },
            onResponseError({ response }) {
                alert('error')
            },
        });

        console.log("response >>>", res);
        roomStore.roomData = res.room
        nextTick(async () => {
            await goto('/multiplayer/room')
        })
    } catch (error) {
        console.log("Error res >>>", error)
    }
    finally {
    }
}
const goto = async (path) => {
    await router.push(path)
    router.go(0)
}

</script>