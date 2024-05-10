import { NavLink } from "react-router-dom";
export default function About() {
  return (
    <>
      <section
        id="about"
        className=" bg-white w-screen h-screen flex items-center justify-center font-TC sm:w-dvw sm:h-dvh"
      >
        <div
          id="frame"
          className="about relative w-3/4 h-3/4 bg-background border-primary border-solid border-8 rounded-2xl py-14 px-10 flex flex-col items-center tb:py-10 tb:pb-20 tb:px-6 tb:h-auto sm:w-10/12 sm:px-3 sm:py-5"
        >
          <h1 className="font-Poetsen text-5xl text-accent text-center pb-2 border-b-2 border-secondary mb-10 tb:text-4xl tb:mb-3 sm:text-2xl sm:mb-2 sm:pb-0">
            <NavLink to="/foodmap">Eat What ?</NavLink>
          </h1>
          <div>
            <p className="text-2xl leading-loose lg:text-xl md:text-lg tb:text-base sm:text-sm">
              常常想不到要吃什麼嗎 <span className=" font-Poetsen">?</span>{" "}
              而且這種狀況一天還要經歷至少兩次，就由我來幫你想吧{" "}
              <span className=" font-Poetsen">!</span> <br />
              透過您的定位，選取想要的距離、價格，幫您隨機選出一間附近的餐廳。
              <br />
              不僅是正餐，咖啡廳和酒吧也可以幫你選{" "}
              <span className=" font-Poetsen">!</span> <br />
              擔心踩雷嗎 <span className=" font-Poetsen">?</span>{" "}
              那就調整評分和評分數量，幫你避雷{" "}
              <span className=" font-Poetsen">!</span>{" "}
            </p>
            <h2 className="text-2xl font-bold mt-3 md:text-lg tb:text-base sm:text-sm">
              使用說明:
            </h2>
            <div className="text-xl md:text-base tb:text-base ml-5 mt-3 tb:ml-1 sm:text-sm sm:ml-1">
              <div className="mb-3 flex">
                <h3 className="text-xl font-bold md:text-base tb:text-base sm:text-sm">
                  距離:{" "}
                </h3>
                <ul className="ml-3 ">
                  <li>
                    <span className=" font-Poetsen">300m: </span>走路時間大約{" "}
                    <span className=" font-Poetsen">5</span> 分
                  </li>
                  <li>
                    <span className=" font-Poetsen">500m: </span>走路時間大約{" "}
                    <span className=" font-Poetsen">10</span> 分
                  </li>
                  <li>
                    <span className=" font-Poetsen">1km: </span>走路時間大約{" "}
                    <span className=" font-Poetsen">20</span> 分
                  </li>
                </ul>
              </div>
              <div className="mb-3">
                <h3 className="text-xl font-bold font-Poetsen md:text-base tb:text-base sm:text-sm">
                  Q & A
                </h3>
                <div className="flex flex-col">
                  <span className="ml-5 sm:ml-3">
                    <span className="font-Poetsen">Q:</span> 對選出的
                    餐廳/咖啡廳/酒吧 不滿意{" "}
                    <span className=" font-Poetsen">?</span>{" "}
                  </span>
                  <span className="ml-5 sm:ml-3">
                    <span className=" font-Poetsen">A: </span>
                    再按幾次試試看，說不定會意外發現寶藏店喔{" "}
                    <span className=" font-Poetsen">!</span>{" "}
                  </span>
                </div>
              </div>
            </div>
            <NavLink
              to="/foodmap"
              className="absolute bottom-40 right-60 font-Poetsen transition-transform duration-300 hover:scale-125 hover:bg-accent rounded-xl  bg-primary text-white text-3xl px-5 py-2 lg:right-32 lg:bottom-60 md:bottom-20 md:right-52 tb:bottom-6 tb:right-40 tb:text-xl tb:hover:scale-110 sm:text-lg sm:right-20 sm:bottom-5 sm:hover:scale-110"
            >
              Go to Map !
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
