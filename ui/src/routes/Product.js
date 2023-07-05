import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function User() {
  let params = useParams();
  const [product, setProduct] = useState([]);
  console.log("params: ", params.productId);

  useEffect(() => {
    // fetch(`http://localhost:3001/user?id=${params.userId}`)
    fetch(`http://localhost:3001/product/${params.productId}`)
      .then((response) => response.json())
      .then((actualData) => {
        console.log("actualData json array: ", actualData);
        setProduct(actualData);
      });
  }, []);

  return (
    <>
      <h1>Product page for product with id: {params.productId}</h1>
      <li>title: {product.title}</li>
      <li>color: {product.color}</li>
      <li>category: {product.category}</li>
    </>
  );
}

export default User;
