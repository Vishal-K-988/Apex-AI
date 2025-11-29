import {create} from "zustand"

type Store = {
    getURL : string | null;
    setGetURL : (url : string) => void;
}

export const useUploadStore = create <Store > () ((set) => ({
    getURL : "",
    setGetURL : (url) => set ({ getURL : url }),
}))


