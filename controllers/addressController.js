const asyncHandler = require("express-async-handler");
const AddressModel = require("../src/models/addressModel");

// Lấy danh sách địa chỉ của người dùng
const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Lấy danh sách địa chỉ của người dùng từ Address (mảng địa chỉ)
  const addresses = await AddressModel.find({ customerId: userId }).select(
    "addresses"
  );

  if (!addresses || addresses.length === 0) {
    res.status(404);
    throw new Error("No addresses found for this user.");
  }

  res.status(200).json({
    message: "Addresses retrieved successfully.",
    data: {
      addresses: addresses[0].addresses, // Trả về mảng địa chỉ
    },
  });
});

// Thêm địa chỉ mới
const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, phone, address, street, isDefault } = req.body;

  // Kiểm tra nếu người dùng đã có địa chỉ mặc định
  if (isDefault) {
    // Đặt địa chỉ hiện tại là không phải mặc định
    await AddressModel.updateMany(
      { customerId: userId, "addresses.isDefault": true },
      { $set: { "addresses.$.isDefault": false } }
    );
  }

  const newAddress = {
    name,
    phone,
    address,
    street,
    isDefault,
  };

  // Cập nhật danh sách địa chỉ cho người dùng
  const addressDoc = await AddressModel.findOne({ customerId: userId });

  if (!addressDoc) {
    const newAddressDoc = new AddressModel({
      customerId: userId,
      addresses: [newAddress],
    });
    await newAddressDoc.save();
  } else {
    addressDoc.addresses.push(newAddress);
    await addressDoc.save();
  }

  res.status(201).json({
    message: "Address added successfully.",
    data: {
      address: newAddress,
    },
  });
});

// Cập nhật địa chỉ
const updateAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;
  const { name, phone, address, street, isDefault } = req.body;

  // Tìm địa chỉ cần cập nhật
  const addressDoc = await AddressModel.findOne({
    customerId: userId,
    "addresses._id": addressId,
  });

  if (!addressDoc) {
    res.status(404);
    throw new Error("Address not found.");
  }

  const addressToUpdate = addressDoc.addresses.id(addressId);

  // Nếu địa chỉ được cập nhật làm mặc định, thì thay đổi các địa chỉ khác thành không mặc định
  if (isDefault) {
    await AddressModel.updateMany(
      { customerId: userId, "addresses.isDefault": true },
      { $set: { "addresses.$.isDefault": false } }
    );
  }

  addressToUpdate.name = name || addressToUpdate.name;
  addressToUpdate.phone = phone || addressToUpdate.phone;
  addressToUpdate.address = address || addressToUpdate.address;
  addressToUpdate.street = street || addressToUpdate.street;
  addressToUpdate.isDefault = isDefault || addressToUpdate.isDefault;

  await addressDoc.save();

  res.status(200).json({
    message: "Address updated successfully.",
    data: {
      address: addressToUpdate,
    },
  });
});

// Xóa địa chỉ
const deleteAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;

  const addressDoc = await AddressModel.findOne({
    customerId: userId,
    "addresses._id": addressId,
  });

  if (!addressDoc) {
    res.status(404);
    throw new Error("Address not found.");
  }

  addressDoc.addresses.pull(addressId);
  await addressDoc.save();

  res.status(200).json({
    message: "Address deleted successfully.",
  });
});

// Đặt địa chỉ mặc định
const setDefaultAddress = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { addressId } = req.params;

  const addressDoc = await AddressModel.findOne({
    customerId: userId,
    "addresses._id": addressId,
  });

  if (!addressDoc) {
    res.status(404);
    throw new Error("Address not found.");
  }

  const address = addressDoc.addresses.id(addressId);

  // Đặt tất cả địa chỉ của người dùng thành không phải mặc định
  await AddressModel.updateMany(
    { customerId: userId, "addresses.isDefault": true },
    { $set: { "addresses.$.isDefault": false } }
  );

  // Đặt địa chỉ này là mặc định
  address.isDefault = true;
  await addressDoc.save();

  res.status(200).json({
    message: "Default address set successfully.",
    data: {
      address,
    },
  });
});

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
