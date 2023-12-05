/* B"H
*/

const API_ROOT = import.meta.env.VITE_API_ROOT as string;

export function rest(url: string, body?: unknown, method?: string){
    return fetch(url, {
        method: method ?? (body ? "POST" : "GET"),
        headers: {
            'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
    })
        .then(response => response.ok 
            ? response.json()
            : response.json().then(err => Promise.reject(err))
        )

}

export function api(action: string, body?: unknown, method?: string){
    return rest(`${API_ROOT}/${action}`, body, method);
}

export type DataEnvelope<T> = {
    data: T,
    isSuccess: boolean,
    error?: string,
}

export type DataListEnvelope<T> = DataEnvelope<T[]> & {
    total: number,
}

/*  Asynchronous patterns in JavaScript
    1. Callbacks
    2. Pipelining
    3. Promises
    4. Async/Await
*/