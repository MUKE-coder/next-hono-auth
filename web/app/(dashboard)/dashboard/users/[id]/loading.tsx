export default function EditLoading() {
  return (
    <>
      <div className="h-screen bg-white flex-col gap-4 w-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-transparent text-yellow-400 text-4xl animate-spin flex items-center justify-center border-t-yellow-400 rounded-full">
          <div className="w-10 h-10 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    </>
  );
}
