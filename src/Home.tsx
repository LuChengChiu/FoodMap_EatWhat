import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Loading from "./Loading";
import "./App.css";
export default function Home() {
  let map: google.maps.Map, infoWindow: google.maps.InfoWindow;
  let service;
  const [userCurrentLocation, setUserCurrentLocation] = useState("");
  const [distance, setDistance] = useState(500);
  const [price, setPrice] = useState([1, 2, 3, 4]);
  const [opening, setOpening] = useState(false);
  const [storeType, setStoreType] = useState(["餐廳"]);
  const [storeNum, setStoreNum] = useState(3);
  const [rate, setRate] = useState();
  const [rateQ, setRateQ] = useState(0);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [restaurants, setRestaurants] = useState("");
  const [theMap, setTheMap] = useState();
  const [oldCircle, setOldCircle] = useState();
  const [oldMarkers, setOldMarkers] = useState();
  const [listMove, setListMove] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.getElementById("map")) {
      initMap();
      infoWindow = new google.maps.InfoWindow();
    }
  }, []);
  const initMap = () => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_REACT_APP_FOOD_MAP_API_KEY,
      version: "weekly",
    });
    loader.load().then(async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      map = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 25.038429, lng: 121.535889 },
        zoom: 15,
      });
      setTheMap(map);
    });
    getCurrentLoc();
  };
  const getCurrentLoc = () => {
    const personSvgMark = {
      path: "M12 21.325q-.35 0-.7-.125t-.625-.375Q9.05 19.325 7.8 17.9t-2.087-2.762t-1.275-2.575T4 10.2q0-3.75 2.413-5.975T12 2t5.588 2.225T20 10.2q0 1.125-.437 2.363t-1.275 2.575T16.2 17.9t-2.875 2.925q-.275.25-.625.375t-.7.125M12 15q1.4 0 2.525-.687T16.3 12.5q-.875-.725-1.975-1.112T12 11t-2.325.388T7.7 12.5q.65 1.125 1.775 1.813T12 15m0-5q.825 0 1.413-.587T14 8t-.587-1.412T12 6t-1.412.588T10 8t.588 1.413T12 10",
      fillColor: "#164cf9",
      fillOpacity: 0.8,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(12, 10),
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserCurrentLocation(userPos);
          map.setCenter(userPos);
          const marker = new google.maps.Marker({
            position: userPos,
            map,
            icon: personSvgMark,
            title: "Your Location",
          });
          infoWindow.setPosition(userPos);
          infoWindow.setContent(marker.getTitle());
          infoWindow.open(marker.getMap(), marker);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter()!);
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  };
  function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
  const searchHandler = () => {
    setErrMsg("");
    setLoading(true);
    if (userCurrentLocation) {
      searchPlace();
    } else {
      setErrMsg("無法偵測到您的目前位置!");
    }
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };
  //   useEffect(() => {
  //     setErrMsg("");
  //     if (userCurrentLocation) {
  //       searchPlace();
  //       console.log("current distance", distance);
  //     }
  //   }, [
  //     userCurrentLocation,
  //     distance,
  //     opening,
  //     storeType,
  //     price,
  //     storeNum,
  //     rate,
  //     rateQ,
  //   ]);
  const searchPlace = () => {
    if (oldCircle) {
      oldCircle.setMap(null);
    }
    // const testLoc = { lat: 25.036309, lng: 121.564212 };
    const circle = new google.maps.Circle({
      strokeColor: "#063ff9",
      strokeOpacity: 0.7,
      strokeWeight: 2,
      fillColor: "#9cb2fc",
      fillOpacity: 0.55,
      map: theMap,
      center: userCurrentLocation,
      radius: distance, // Radius in meters
    });
    setOldCircle(circle);
    let request = {
      location: userCurrentLocation,
      radius: distance,
      openNow: opening,
      type: storeType,
    };
    service = new google.maps.places.PlacesService(theMap);
    service.nearbySearch(request, cb);
  };
  const cb = (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      const b4FilterResult: Array<object> = [];
      for (let i = 0; i < results.length; i++) {
        b4FilterResult.push(results[i]);
      }
      checkSectionQuality(b4FilterResult);
      const filterList = resultFilter(b4FilterResult);
      const finalIndexs = [];
      if (filterList.length >= storeNum) {
        while (finalIndexs.length < storeNum && filterList.length > 0) {
          let randomIndex = Math.floor(Math.random() * filterList?.length);
          if (!finalIndexs.includes(randomIndex)) {
            finalIndexs.push(randomIndex);
          }
        }
        const finalPick = finalIndexs.map((index) => {
          return filterList[index];
        });
        console.log(finalPick);
        setRestaurants(finalPick);
        createMarker(finalPick);
      } else {
        if (filterList.length == 0) {
          setErrMsg(`範圍內沒有符合條件的${storeType}`);
          return;
        }
        setErrMsg(
          `符合篩選條件的${storeType}數量少於${storeNum}間，只有${filterList.length}間`
        );
        setRestaurants(filterList);
        createMarker(filterList);
      }
    }
  };
  const resultFilter = (list) => {
    const filterPrice = list.filter((store) => {
      if (price.includes(store.price_level)) {
        return store;
      }
    });
    if (rate && rate >= 1) {
      const filterRate = filterPrice.filter((store) => {
        return store.rating >= rate;
      });
      if (rateQ > 0) {
        const filterRateAmount = filterRate.filter((store) => {
          return store.user_ratings_total >= rateQ;
        });
        return filterRateAmount;
      } else {
        return filterRate;
      }
    } else if (rateQ > 0) {
      const filterRateAmount = filterPrice.filter((store) => {
        return store.user_ratings_total >= rateQ;
      });
      return filterRateAmount;
    } else {
      return filterPrice;
    }
  };
  const priceHandler = (e) => {
    const change = parseInt(e.target.value);
    const oldPrices = [...price];
    if (oldPrices.includes(change)) {
      const newPrices = oldPrices.filter((price) => {
        return price !== change;
      });
      setPrice(newPrices);
    } else {
      oldPrices.push(change);
      setPrice(oldPrices);
    }
  };
  const createMarker = (list) => {
    if (oldMarkers) {
      for (let i = 0; i < oldMarkers.length; i++) {
        oldMarkers[i].setMap(null);
      }
    }
    const markerList = [];
    for (let i = 0; i < list.length; i++) {
      const marker = new google.maps.Marker({
        position: list[i].geometry.location,
        map: theMap,
        title: list[i].name,
      });
      marker.addListener("click", () => {
        infoWindow.close();
        infoWindow.setContent(marker.getTitle());
        infoWindow.open(marker.getMap(), marker);
      });
      markerList.push(marker);
    }
    setOldMarkers(markerList);
  };
  const checkSectionQuality = (list) => {
    setMsg("");
    for (let i = 0; i < list.length; i++) {
      if (list[i].rating >= 3.5 || list[i].user_ratings_total >= 100) {
        // setMsg(`🔍美食沙漠發現!`);
        return false;
      }
      setMsg(`🔍美食沙漠發現!`);
    }
  };
  return (
    <>
      <section id="home" className="w-screen h-dvh flex relative font-TC">
        {/* {loading && (
          <div className="absolute z-50 bg-gray-400 opacity-70 w-full h-full flex justify-center items-center">
            <Loading></Loading>
          </div>
        )} */}
        <div
          className={
            "flex absolute top-28 left-1/2 -translate-x-1/2 z-30 bg-white rounded-lg px-3 py-2 transition-opacity duration-300 shadow-md shadow-gray-400 md:left-28 md:top-64 tb:left-28 tb:top-72 sm:left-20 sm:top-52 sm:text-sm " +
            (msg ? "opacity-100" : "opacity-0")
          }
        >
          {msg}
        </div>
        <div
          className={
            "flex absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-white rounded-lg px-3 py-2 transition-opacity duration-300 shadow-md shadow-gray-400 md:left-28 md:top-72 tb:left-28 tb:top-72 sm:left-32 sm:top-52 sm:text-xs " +
            (errMsg ? "opacity-100" : "opacity-0")
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className="mr-1 text-yellow-500"
          >
            <path
              fill="currentColor"
              d="M2.725 21q-.275 0-.5-.137t-.35-.363t-.137-.488t.137-.512l9.25-16q.15-.25.388-.375T12 3t.488.125t.387.375l9.25 16q.15.25.138.513t-.138.487t-.35.363t-.5.137zM12 18q.425 0 .713-.288T13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18m0-3q.425 0 .713-.288T13 14v-3q0-.425-.288-.712T12 10t-.712.288T11 11v3q0 .425.288.713T12 15"
            />
          </svg>
          {errMsg}
        </div>
        <div className="bg-white text-text absolute top-20 left-10 z-10 rounded-3xl overflow-hidden flex flex-col items-center shadow-2xl shadow-gray-500 md:top-14 tb:left-1.5 tb:top-14 sm:left-0 sm:top-0 sm:h-auto sm:w-dvw sm:rounded-none sm:shadow-lg">
          <div className="h-16 flex items-center pl-5 text-accent text-left w-full md:h-10 md:pt-2 tb:h-9 sm:h-8 sm:pt-3 sm:mb-2">
            <span className="font-Poetsen text-4xl sm:text-2xl">Eat What?</span>
            <NavLink
              to="about"
              className="absolute right-12 top-5 w-4 text-text opacity-60 transition-transform transition-opacity duration-200 hover:scale-110 hover:opacity-100 md:top-2 md:right-10 sm:top-2 sm:right-8"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.2q.325-.9 1.088-1.45T12 1t1.713.55T14.8 3H19q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm3-4h5q.425 0 .713-.288T14 16t-.288-.712T13 15H8q-.425 0-.712.288T7 16t.288.713T8 17m0-4h8q.425 0 .713-.288T17 12t-.288-.712T16 11H8q-.425 0-.712.288T7 12t.288.713T8 13m0-4h8q.425 0 .713-.288T17 8t-.288-.712T16 7H8q-.425 0-.712.288T7 8t.288.713T8 9m4-4.75q.325 0 .538-.213t.212-.537t-.213-.537T12 2.75t-.537.213t-.213.537t.213.538t.537.212"
                />
              </svg>
            </NavLink>
          </div>
          <form className="text-xl flex flex-col items-start px-5 md:flex-row tb:flex-row sm:flex-row tb:text-base sm:text-sm tb:px-1 sm:px-2 sm:w-full">
            <div className="flex items-center justify-around my-1.5 md:flex-col tb:flex-col sm:flex-col">
              <span className="font-bold mr-4 tracking-tighter md:mr-0 md:mb-2 tb:mr-0 tb:mb-2 sm:mr-0 sm:mb-2 sm:write-updown sm:mt-1">
                營業中
              </span>
              <div>
                <input
                  type="checkbox"
                  name="open"
                  id="open"
                  value="true"
                  onClick={() => setOpening(!opening)}
                  className="toggle-check-input"
                />
                <label
                  htmlFor="open"
                  className="toggle-check tb:mr-2 sm:before:w-7 sm:before:h-3"
                >
                  <span></span>
                </label>
              </div>{" "}
            </div>
            <div className="flex items-center justify-around my-1.5 md:flex-col md:mx-1.5  tb:flex-col tb:mx-1.5 sm:flex-col sm:mx-1.5 sm:ml-0.5">
              <span className="font-bold mr-4 md:mr-0 tb:mr-0 sm:mr-0">
                距離
              </span>
              <div className="input-frame w-52 h-8 justify-center font-Poetsen text-base md:flex-col md:w-auto md:h-auto md:rounded-lg md:after:rounded-lg tb:flex-col tb:w-auto tb:h-auto tb:rounded-lg tb:after:rounded-lg tb:text-sm sm:flex-col sm:w-auto sm:h-auto sm:rounded-lg sm:after:rounded-lg sm:text-xs">
                <input
                  type="radio"
                  name="distance"
                  id="distance300"
                  value="300"
                  onClick={(e) => setDistance(parseInt(e.target.value))}
                  className="toggle-input"
                />
                <label
                  htmlFor="distance300"
                  className="toggle-label px-4 tb:px-1.5 sm:px-1"
                >
                  300m {/* 300 走路5分大約 */}
                </label>
                <input
                  type="radio"
                  name="distance"
                  id="distance500"
                  value="500"
                  defaultChecked={true}
                  onClick={(e) => setDistance(parseInt(e.target.value))}
                  className="toggle-input"
                />
                <label
                  htmlFor="distance500"
                  className="toggle-label px-3 tb:px-1.5 sm:px-1"
                >
                  500m {/* 走路10分大約 */}
                </label>
                <input
                  type="radio"
                  name="distance"
                  id="distance1000"
                  value="1000"
                  onClick={(e) => setDistance(parseInt(e.target.value))}
                  className="toggle-input"
                />
                <label
                  htmlFor="distance1000"
                  className="toggle-label px-4 tb:px-1.5 sm:px-1"
                >
                  1km {/* 走路20分大約 */}
                </label>
              </div>
            </div>
            <div className="flex items-center justify-around my-1.5 md:flex-col md:mr-1.5 tb:flex-col tb:mr-1.5 sm:flex-col sm:mr-1.5">
              <span className="font-bold mr-4 md:mr-0 tb:mr-0 sm:mr-0">
                價格
              </span>
              <div
                className="input-frame w-52 h-8 justify-center font-Poetsen text-base md:flex-col md:w-auto md:h-auto md:rounded-lg md:after:rounded-lg
              tb:flex-col tb:w-auto tb:h-auto tb:rounded-lg tb:after:rounded-lg tb:text-base sm:text-xs
              sm:flex-col sm:w-auto sm:h-auto sm:rounded-lg sm:after:rounded-lg"
              >
                <input
                  type="checkbox"
                  name="priceRange"
                  id="price1"
                  value="1"
                  defaultChecked={true}
                  onChange={priceHandler}
                  className="toggle-input"
                />
                <label
                  htmlFor="price1"
                  className="toggle-label w-14 tb:w-12 tb:py-0.5 sm:w-10"
                >
                  $
                </label>{" "}
                <input
                  type="checkbox"
                  name="priceRange"
                  id="price2"
                  value="2"
                  defaultChecked={true}
                  onChange={priceHandler}
                  className="toggle-input"
                />
                <label
                  htmlFor="price2"
                  className="toggle-label w-14 tb:w-12 tb:py-0.5 sm:w-10"
                >
                  $$
                </label>
                <input
                  type="checkbox"
                  name="priceRange"
                  id="price3"
                  value="3"
                  defaultChecked={true}
                  onChange={priceHandler}
                  className="toggle-input"
                />
                <label
                  htmlFor="price3"
                  className="toggle-label w-14 tb:w-12 tb:py-0.5 sm:w-10"
                >
                  $$$
                </label>
                <input
                  type="checkbox"
                  name="priceRange"
                  id="price4"
                  value="4"
                  defaultChecked={true}
                  onChange={priceHandler}
                  className="toggle-input"
                />{" "}
                <label
                  htmlFor="price4"
                  className="toggle-label w-14 tb:w-12 tb:py-0.5 sm:w-10"
                >
                  $$$$
                </label>
              </div>
            </div>
            <div className="flex items-center justify-around my-1.5 md:flex-col md:mr-1.5 tb:flex-col tb:mr-1.5 sm:flex-col sm:mr-1.5">
              <span className="font-bold mr-4 md:mr-0 tb:mr-0 sm:mr-0">
                類型
              </span>
              <div
                className="input-frame w-52 justify-center h-8 text-base md:flex-col md:w-auto md:h-auto md:rounded-lg md:after:rounded-lg tb:flex-col tb:w-16 tb:text-sm tb:h-auto tb:rounded-lg tb:after:rounded-lg
              sm:flex-col sm:w-auto sm:h-auto sm:rounded-lg sm:after:rounded-lg sm:text-xs"
              >
                <input
                  type="radio"
                  name="storeType"
                  id="restaurant"
                  value="restaurant"
                  defaultChecked={true}
                  onChange={(e) => {
                    setStoreType([e.target.value]);
                  }}
                  className="toggle-input"
                />
                <label
                  htmlFor="restaurant"
                  className="toggle-label px-4 tb:px-1.5 sm:px-1.5"
                >
                  餐廳
                </label>
                <input
                  type="radio"
                  name="storeType"
                  id="cafe"
                  value="cafe"
                  onChange={(e) => {
                    setStoreType([e.target.value]);
                  }}
                  className="toggle-input"
                />{" "}
                <label
                  htmlFor="cafe"
                  className="toggle-label px-3 tb:px-1.5 sm:px-1.5"
                >
                  咖啡廳
                </label>
                <input
                  type="radio"
                  name="storeType"
                  id="bar"
                  value="bar"
                  onChange={(e) => {
                    setStoreType([e.target.value]);
                  }}
                  className="toggle-input"
                />
                <label
                  htmlFor="bar"
                  className="toggle-label px-4 tb:px-1.5 sm:px-1.5"
                >
                  酒吧
                </label>
              </div>
            </div>
            <div className="md:ml-3 tb:ml-1 sm:ml-1">
              <div className="flex items-center my-1.5 relative">
                <label
                  htmlFor="num"
                  className="font-bold mr-4 tracking-tighter tb:mr-2 sm:mr-1"
                >
                  店家數
                </label>
                <div className="relative h-5 w-40 flex items-center tb:w-32 sm:w-24">
                  <input
                    type="range"
                    id="num"
                    name="num"
                    min={1}
                    max={5}
                    step={1}
                    defaultValue={3}
                    onChange={(e) => {
                      setStoreNum(e.target.value);
                    }}
                  />
                </div>
                <span className="font-Poetsen relative right-3 tb:-right-1 sm:-right-1">
                  {storeNum}
                </span>
              </div>
              <div className="">
                <div className="flex flex-col my-1.5 md:flex-row md:mt-2.5 tb:flex-row tb:mt-1 sm:flex-row sm:mt-1">
                  <span className="font-bold mb-1 md:mr-1 md:mb-0 tb:mr-1.5 tb:mb-0 sm:mr-0.5 sm:mb-0 sm:mt-0.5">
                    評分
                  </span>
                  <div className="font-Poetsen input-frame w-72 h-7 justify-center text-base md:w-52 tb:text-sm tb:w-44 sm:w-32 sm:text-xs">
                    <input
                      type="radio"
                      name="rate"
                      id="rate-25"
                      value={2.5}
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                      className="toggle-input"
                    />
                    <label
                      htmlFor="rate-25"
                      className="toggle-label w-16 tb:w-10 sm:w-6"
                    >
                      2.5<span className="sm:hidden">+</span>
                    </label>
                    <input
                      type="radio"
                      name="rate"
                      id="rate-3"
                      value={3}
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                      className="toggle-input"
                    />{" "}
                    <label
                      htmlFor="rate-3"
                      className="toggle-label w-16 tb:w-10 sm:w-6"
                    >
                      3.0<span className="sm:hidden">+</span>
                    </label>
                    <input
                      type="radio"
                      name="rate"
                      id="rate-35"
                      value={3.5}
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                      className="toggle-input"
                    />{" "}
                    <label
                      htmlFor="rate-35"
                      className="toggle-label w-16 tb:w-10 sm:w-6"
                    >
                      3.5<span className="sm:hidden">+</span>
                    </label>
                    <input
                      type="radio"
                      name="rate"
                      id="rate-4"
                      value={4}
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                      className="toggle-input"
                    />{" "}
                    <label
                      htmlFor="rate-4"
                      className="toggle-label w-16 tb:w-10 sm:w-6"
                    >
                      4.0<span className="sm:hidden">+</span>
                    </label>
                    <input
                      type="radio"
                      name="rate"
                      id="rate-45"
                      value={4.5}
                      onChange={(e) => {
                        setRate(e.target.value);
                      }}
                      className="toggle-input"
                    />{" "}
                    <label
                      htmlFor="rate-45"
                      className="toggle-label w-16 tb:w-10 sm:w-6"
                    >
                      4.5<span className="sm:hidden">+</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center my-3 relative">
                  <label
                    htmlFor="rate-num"
                    className="font-bold tracking-tighter mr-2 sm:mb-1"
                  >
                    評論數
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="rate-num"
                      id="rate-num"
                      min={0}
                      max={1000}
                      step={100}
                      onChange={(e) => setRateQ(parseInt(e.target.value))}
                      className="w-40 tb:w-24 sm:w-24"
                    />
                  </div>
                  <span className="font-Poetsen relative left-2.5 sm:left-1 sm:absolute sm:-bottom-3 ">
                    {rateQ}+
                  </span>
                </div>
              </div>
            </div>{" "}
          </form>{" "}
          <button
            onClick={searchHandler}
            className="px-2 py-1 mb-4 mt-1 relative rounded-lg bg-primary text-background transition-all duration-300 hover:bg-accent hover:scale-110 md:absolute md:left-5 md:bottom-3 tb:absolute tb:left-2 tb:bottom-3 tb:py-0.5 sm:absolute sm:left-3 sm:bottom-1 sm:py-0 sm:px-1 sm:m-0"
          >
            {/* 找 {storeType} */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              className="tb:w-6 sm:w-5 sm:h-6"
            >
              <path
                fill="currentColor"
                d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
              />
            </svg>
          </button>
        </div>
        {restaurants?.length > 0 && (
          <div
            className={
              "absolute bg-white left-10 bottom-20 z-10 rounded-3xl px-3.5 py-3 w-80 h-72  shadow-2xl shadow-gray-500 overflow-hidden md:bottom-2 md:left-0 md:w-11/12 md:h-28 md:ml-2 tb:bottom-2 tb:left-0 tb:w-11/12 tb:h-28 tb:ml-2 sm:bottom-2 sm:left-0 sm:w-10/12 sm:h-24 sm:ml-2 " +
              (storeNum < 2
                ? "h-32 bottom-52"
                : storeNum < 3 && "h-48 bottom-36")
            }
          >
            <span className="text-lg font-bold text-center block bg-white md:text-left tb:text-left sm:text-left tb:text-base sm:text-base">
              為你選中的{storeType}
            </span>
            <div
              className={
                "w-full h-60 overflow-hidden md:h-auto tb:h-auto sm:h-auto"
              }
            >
              <button
                className={
                  "flex justify-center items-center bg-white absolute top-10 left-1/2 -translate-x-1/2 w-full z-20 h-6 transition-opacity duration-300 ease-in hover:text-accent md:hidden tb:hidden sm:hidden " +
                  (storeNum <= 3
                    ? "opacity-0 pointer-events-none"
                    : !listMove
                    ? "opacity-0 pointer-events-none"
                    : "opacity-100")
                }
                onClick={(e) => setListMove(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="m7 14l5-5l5 5z" />
                </svg>
              </button>
              <div
                className={
                  "w-full h-11/12 transition-transform duration-700 ease-out flex flex-col md:flex-row md:h-auto md:overflow-auto tb:flex-row tb:h-auto tb:overflow-auto sm:flex-row sm:h-auto sm:overflow-auto " +
                  (listMove && "list-move")
                }
              >
                {restaurants?.map((store) => {
                  function isNumberWithDecimal(num) {
                    return Number.isFinite(num) && num % 1 !== 0;
                  }
                  return (
                    <div
                      className="w-full h-16 mb-2 flex justify-between items-center border-primary border-b md:border-b-0 md:border-r md:mr-2 md:pr-2
                    tb:border-b-0 tb:border-r tb:mr-2 tb:pr-2 tb:mb-0
                    sm:border-b-0 sm:border-r sm:mr-2 sm:pr-2 sm:mb-0"
                    >
                      <div className="h-full flex flex-col justify-center w-40">
                        <h4 className="text-lg tracking-tighter font-bold truncate sm:text-base">
                          {store.name}
                        </h4>{" "}
                        <span className="text-sm truncate sm:text-xs">
                          {store.vicinity}
                        </span>
                      </div>
                      <div className="flex flex-col items-end justify-center h-full sm:text-sm">
                        <span className="font-Poetsen text-accent">
                          {store.price_level === 4
                            ? "$$$$"
                            : store.price_level === 3
                            ? "$$$"
                            : store.price_level === 2
                            ? "$$"
                            : "$"}
                        </span>
                        <div className="flex font-Poetsen">
                          <span className="flex mr-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              className="mr-0.5 mt-0.5 text-yellow-500"
                            >
                              <path
                                fill="currentColor"
                                d="m7.625 6.4l2.8-3.625q.3-.4.713-.587T12 2t.863.188t.712.587l2.8 3.625l4.25 1.425q.65.2 1.025.738t.375 1.187q0 .3-.088.6t-.287.575l-2.75 3.9l.1 4.1q.025.875-.575 1.475t-1.4.6q-.05 0-.55-.075L12 19.675l-4.475 1.25q-.125.05-.275.063T6.975 21q-.8 0-1.4-.6T5 18.925l.1-4.125l-2.725-3.875q-.2-.275-.288-.575T2 9.75q0-.625.363-1.162t1.012-.763z"
                              />
                            </svg>{" "}
                            {isNumberWithDecimal(store.rating)
                              ? store.rating
                              : store.rating + ".0"}
                          </span>
                          <span className="flex">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              className="mr-0.5 mt-0.5 text-text"
                            >
                              <path
                                fill="currentColor"
                                d="M7 14h10q.425 0 .713-.288T18 13t-.288-.712T17 12H7q-.425 0-.712.288T6 13t.288.713T7 14m0-3h10q.425 0 .713-.288T18 10t-.288-.712T17 9H7q-.425 0-.712.288T6 10t.288.713T7 11m0-3h10q.425 0 .713-.288T18 7t-.288-.712T17 6H7q-.425 0-.712.288T6 7t.288.713T7 8M4 18q-.825 0-1.412-.587T2 16V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v15.575q0 .675-.612.938T20.3 20.3L18 18z"
                              />
                            </svg>{" "}
                            {store.user_ratings_total}
                          </span>
                        </div>{" "}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className={
                " bg-white absolute bottom-0 left-1/2 flex justify-center -translate-x-1/2 w-full transition-opacity duration-300 ease-in rounded-3xl hover:text-accent md:hidden tb:hidden sm:hidden " +
                (storeNum <= 3
                  ? "opacity-0 pointer-events-none"
                  : listMove
                  ? "opacity-0 pointer-events-none"
                  : "opacity-100")
              }
              onClick={(e) => setListMove(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M11.475 14.475L7.85 10.85q-.075-.075-.112-.162T7.7 10.5q0-.2.138-.35T8.2 10h7.6q.225 0 .363.15t.137.35q0 .05-.15.35l-3.625 3.625q-.125.125-.25.175T12 14.7t-.275-.05t-.25-.175"
                />
              </svg>
            </button>
          </div>
        )}
        <div
          id="map"
          className="w-full h-full map-frame sm:h-3/4 relative top-36"
        ></div>
      </section>
    </>
  );
}