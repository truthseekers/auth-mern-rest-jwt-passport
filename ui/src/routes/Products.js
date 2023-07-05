import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/products`)
      .then((response) => response.json())
      .then((actualData) => {
        console.log("actualData json array: ", actualData);
        setProducts(actualData);
      });
  }, []);

  return (
    <>
      <h2>Products w strategies and .env: </h2>
      <ul>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <Link key={product.id} to={`/product/${product.id}`}>
                {product.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default Products;
