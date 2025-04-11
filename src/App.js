import "./index.css";
import { products } from "./utils/products";
import { useState } from "react";

function App() {
  const [selectedItem, setSelectedItem] = useState([]);
  const [order, setOrder] = useState([]);

  // handle checkbox
  const toggleItem = (item, e) => {
    if (e.target.checked) {
      setSelectedItem((prev) => [...prev, item]);
    } else {
      setSelectedItem((prev) => prev.filter((i) => i.name !== item.name));
    }
  };

  const courierCharge = (weight) => {
    if (weight <= 200) return 5;
    if (weight <= 500) return 10;
    if (weight <= 1000) return 15;
    return 20;
  };

  const handleOrder = () => {
    const maxPricePerPackage = 250;
    let packed = [];
    let currentPackage = {
      name: [],
      price: 0,
      weight: 0,
      courierCharge: 0,
    };

    // sorted descending
    const sorted = [...selectedItem].sort((a, b) => a.price - b.price);

    //handle single item edge case
    if (sorted.length === 1) {
      const item = sorted[0];
      packed.push({
        name: [item.name],
        price: item.price,
        weight: item.weight,
        courierCharge: courierCharge(item.weight),
      });
      setOrder(packed);
      return;
    }

    for (const item of sorted) {
      // check if adding current item price exceeds price limit, store current package and start a new one
      if (currentPackage.price + item.price > maxPricePerPackage) {
        currentPackage.courierCharge = courierCharge(currentPackage.weight);
        packed.push({ ...currentPackage });

        //  reset currentCharge
        currentPackage = {
          name: [],
          price: 0,
          weight: 0,
        };
      }

      currentPackage.name.push(item.name);
      currentPackage.price += item.price;
      currentPackage.weight += item.weight;
    }

    //remaining last item less than price exceeds which is still at currentPage not in packed
    if (currentPackage.name.length > 0) {
      currentPackage.courierCharge = courierCharge(currentPackage.weight);
      packed.push({ ...currentPackage });
    }
    setOrder(packed);
  };

  return (
    <div className="w-full font-serif">
      {/* title */}
      <h2 className=" text-2xl font-bold font-serif text-center mt-5">
        E-commerce Website
      </h2>

      {/* list of products */}
      <div className="space-y-2 max-h-96 overflow-y-auto font-serif flex flex-col justify-center items-center">
        {products.map((item, i) => (
          <div
            key={i}
            className=" border border-bg-gray-400 w-36 p-2 rounded-md shadow-sm"
          >
            <div className="flex justify-between">
              <label htmlFor={item.name} className="font-semibold text-xl">
                {item.name}
              </label>
              <input
                type="checkbox"
                onChange={(e) => toggleItem(item, e)}
                checked={selectedItem.some((i) => i.name === item.name)}
              />
            </div>
            <p>Price: {item.price}</p>
            <p>Weight: {item.weight}</p>
          </div>
        ))}
      </div>
      <button
        className=" mx-auto block my-4 px-4 py-1 text-white bg-cyan-900 shadow-md rounded-md"
        onClick={handleOrder}
        type="submit"
      >
        Place Order
      </button>

      {/* render Order */}
      {order.length > 0 && (
        <div className=" space-y-2 w-full mx-auto">
          <h2>This order has following packages:</h2>
          {order.map((item, i) => (
            <div key={i}>
              <h2 className=" font-semibold">Packages {i + 1}</h2>
              <p>name: {item.name > 0 ? item.name.join(", ") : item.name}</p>
              <p>Total Price: ${item.price}</p>
              <p>Total Weight: ${item.weight}</p>
              <p>Total Weight: ${item.courierCharge}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
