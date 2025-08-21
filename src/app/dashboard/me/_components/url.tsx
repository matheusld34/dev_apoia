export function UrlPreview() {
    return (
        <div className="flex items-center flex-1 p-2 text-gray-100">
            <form>
                <div className="flex items-center justify-center w-full">
                    <p
                        className="w-fit h-9 rounded-md flex items-center font-semibold text-white"
                    >
                        {process.env.NEXT_PUBLIC_HOST_URL}/creator/
                    </p>
                    <input
                        type="text"
                        className="flex-1 outline-none border h-9 border-gray-300 text-black rounded-md"
                    />
                </div>
            </form>
        </div>
    )
}