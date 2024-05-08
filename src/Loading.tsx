export default function Loading() {
  return (
    <>
      <div className="lds-spinner text-primary relative z-10 after:absolute after:-top-3 after:-left-2 after:rounded-xl after:w-24 after:h-24 after:bg-white after:-z-10">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
}
