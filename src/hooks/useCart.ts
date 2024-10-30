// useCart.ts
import { useEffect, useState } from "react";
import { useMemo } from "react";
import { useCookies } from "react-cookie";
import { ProductType } from "../types";
import { getProduct } from "../utils/api";

type CartType = ProductType & { count: number };

const COOKIE_KEY = "cart" as const;

const useCart = () => {
  const [cookies, setCookies] = useCookies([COOKIE_KEY]);
  const [carts, setCarts] = useState<CartType[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // const productIds = useMemo(
  //   () => (cookies[COOKIE_KEY] as string[]) ?? [],
  //   [cookies]
  // );

  // Safely parse the cookie value and handle any potential parsing errors
  const productIds = useMemo(() => {
    try {
      // Attempt to decode and parse the cookie
      const cookieValue = cookies[COOKIE_KEY];
      if (cookieValue) {
        // Handle cases where the cookie is not already an array but a URL-encoded string
        const decodedValue = decodeURIComponent(cookieValue);
        return JSON.parse(decodedValue) as string[];
      }
    } catch (error) {
      console.error("Error parsing cookie value:", error);
    }
    return [];
  }, [cookies]);

  const addCarts = (id: string) => {
    const nextCartIds = [...productIds, id];
    // setCookies(COOKIE_KEY, nextCartIds, {
    //   path: "/",
    // });
    // Safely stringify and store the updated productIds in the cookie
    setCookies(COOKIE_KEY, encodeURIComponent(JSON.stringify(nextCartIds)), {
      path: "/",
    });
  };

  const changeCount = (productId: string, mode: "increase" | "decrease") => {
    const index = productIds.indexOf(productId);
    if (index === -1) {
      return;
    }

    if (mode === "decrease") {
      const tempArr = [...productIds];
      tempArr.splice(index, 1);

      if (!tempArr.includes(productId)) {
        return;
      }

      // setCookies(COOKIE_KEY, tempArr, {
      //   path: "/",
      // });
      setCookies(COOKIE_KEY, encodeURIComponent(JSON.stringify(tempArr)), {
        path: "/",
      });
    }

    if (mode === "increase") {
      // setCookies(COOKIE_KEY, [...productIds, productId], {
      //   path: "/",
      // });
      setCookies(
        COOKIE_KEY,
        encodeURIComponent(JSON.stringify([...productIds, productId])),
        {
          path: "/",
        }
      );
    }
  };

  useEffect(() => {
    if (productIds && productIds.length) {
      setLoading(true); // 데이터를 불러오기 시작할 때 로딩 상태 설정
      const requestList: Array<Promise<any>> = [];
      const requestIds = productIds.reduce(
        (acc, cur) => acc.set(cur, (acc.get(cur) || 0) + 1),
        new Map<string, number>()
      );

      Array.from(requestIds.keys()).forEach((id) => {
        requestList.push(getProduct(id));
      });
      Promise.all(requestList)
        .then((responseList) => {
          const cartsData: CartType[] = responseList
            // .filter(
            //   (response) => response && response.data && response.data.product
            // ) // null 체크
            // .map((response) => ({
            //   ...response.data.product,
            //   count: requestIds.get(response.data.product.id),
            // }));
            .map((response) => {
              // Check if response exists
              if (response) {
                return {
                  ...response, // Assuming response itself is the product
                  count: requestIds.get(response.id || 0), // Safely access id from the response
                };
              }
              return null; // If no response, return null
            })
            .filter((cart) => cart !== null); // Remove null values
          setCarts(cartsData);
        })
        .finally(() => {
          setLoading(false); // Data load completion
        })
        .catch((error) => {
          console.error("Failed to fetch products:", error);
          setLoading(false); // In case of an error
        });
    } else {
      setLoading(false); // 장바구니가 비어 있을 때 로딩 상태 해제
    }
  }, [productIds]);

  return {
    carts,
    addCarts,
    changeCount,
    loading, // 로딩 상태 반환
  };
};

export default useCart;
