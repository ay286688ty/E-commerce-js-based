import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    // add quantity for each product

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    re.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({
      message: "Server Errror in getting the cart products",
      error: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({
      message: "Server Error in adding to cart",
      error: error.message,
    });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user, cartItems);
  } catch (error) {
    res.status(500).json({
      message: "Server Error in removing all the cart from the application",
      error: error.message,
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cardItems = user.cartItems.map((item) => item.id !== productId);
        await user.save();
        res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Item not found in the cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller", error.message);
    res.status(500).json({
      message: "Server Error in updating the quantity of the cart",
      error: error.message,
    });
  }
};
