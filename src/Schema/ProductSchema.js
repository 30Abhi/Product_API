import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const { Schema } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const productSchema = new Schema({
    id: { type: Number },
    name: {
        type: String,
        lowercase: true,
        index: 1,
        es_type: "search_as_you_type",
    },
    _name: { type: String, lowercase: true },
    description: { type: String },

    aiDesc: { type: String, default: null },
    aiSearchkeywords: { type: [String], default: [] },
    aiFAQS: { type: [Object], default: [] },
    aiUses: { type: String, default: null },
    aiBenefits: { type: String, default: null },
    aiNutritionFacts: { type: [Object], default: [] },

    lDescription: { type: String, lowercase: true },
    shortDesc: { type: String },
    lShortDesc: { type: String, lowercase: true },
    price: Number,
    unit: String,
    categoryId: { type: Schema.Types.ObjectId },
    categories: [Schema.Types.ObjectId],
    rating: Number,
    gst: Number,
    gstId: { type: Schema.Types.ObjectId },
    gstDesc: { type: String, lowercase: true },
    hsnCode: String,
    availability: Boolean,
    quantity: { type: Number, default: 0 },
    subscriptionQuantity: { type: Number, default: 0 },
    perUserOrderQuantity: { type: Number, default: 0 },
    perUserSubscriptionQuantity: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, default: null },
    isParent: { type: Boolean, default: true },
    childProducts: [
        {
            productId: { type: Schema.Types.ObjectId, default: null },
            recommendedAttribute: { type: String, lowercase: true },
        },
    ],
    extraService: {
        inHandPrice: Number,
        onDoorPrice: Number,
        withBagPrice: Number,
        withBottlePrice: Number,
    },
    seo: {
        metaTitle: { type: String },
        metaKeywords: { type: String },
        metaDescription: { type: String },
        canonical: String,
    },
    urlKey: { type: String, lowercase: true },
    images: [{ type: String }],
    tags: [],
    assets: {
        images: [
            {
                width: String,
                height: String,
                src: String,
            },
        ],
    },
    searchingNumber: { type: Number, default: 0 },
    offer: Number,
    membershipPrice: { type: Number, default: 0 },
    isLastBuy: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isDailyDeal: { type: Boolean, default: false },
    isFeatureSale: { type: Boolean, default: false },
    isSubscription: Boolean,
    isOrder: Boolean,
    isMorningBuy: Boolean,
    brand: {
        id: { type: Schema.Types.ObjectId },
        image: [String],
        name: { type: String, lowercase: true },
    },
    subBrand: {
        id: { type: Schema.Types.ObjectId },
        image: [String],
        name: { type: String, lowercase: true },
    },
    shipping: {
        unit: { type: String, default: "mm" },
        dimensions: {
            height: { type: Number, default: 0 },
            length: { type: Number, default: 0 },
            width: { type: Number, default: 0 },
        },
        weight: { type: Number, default: 0 },
        weightUnit: { type: String, default: "grm" },
    },
    attrs: [
        {
            name: { type: String, lowercase: true },
            value: [String],
        },
    ],
    variants: {
        attrs: [
            {
                displayType: { type: String, lowercase: true },
                name: { type: String, lowercase: true },
            },
        ],
    },
    verification: {
        isImageVerify: { type: Boolean, default: false },
        isproductDetailVerify: { type: Boolean, default: false },
        isApproved: { type: Boolean, default: false },
    },
    approvedBy: { type: Schema.Types.ObjectId },
    isHold: { type: Boolean, default: false },
    status: { type: String, lowercase: true, default: "new" },
    addedBy: {
        type: { type: String, lowercase: true, default: "admin" },
        id: { type: Schema.Types.ObjectId },
    },
    sku: { type: String, lowercase: true },
    skuDescription: {
        type: String,
        lowercase: true,
        default: "metro wholesale",
    },
    minSellPrice: { type: Number, default: null },
    sellPrice: Number,
    size: {
        length: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
    },
    sizeUnit: { type: String, default: "CM" },
    created: Number,
    updated: Number,
    date: { type: Date },
    isActive: { type: Boolean, default: false },
    veg: { type: Boolean, default: false },
    nonveg: { type: Boolean, default: false },
    recommendedAttribute: { type: String, lowercase: true },
    addmore: {},
    barCode: { type: String, lowercase: true },
    altBarCodes: [{ type: String, lowercase: true }],
    productFamilyId: { type: Schema.Types.ObjectId, default: null },
    cityIds: [],
    competitor: {
        grofers: {
            productId: { type: String },
            merchantId: { type: String },
            lastPrice: Number,
        },
        milkbasket: {
            productId: { type: String },
            merchantId: { type: String },
            lastPrice: Number,
        },
        bigbasket: {
            productId: { type: String },
            merchantId: { type: String },
            lastPrice: Number,
        },
        grocio: {
            productId: { type: String },
            merchantId: { type: String },
            lastPrice: Number,
        },
    },
    purchasePrice: Number,
    manufacturerDetails: { type: String, lowercase: true },
    country: { type: String, lowercase: true },
    expiryMonth: { type: String, lowercase: true },
    fssaiNo: { type: String, lowercase: true },
    isCouponApplicable: { type: Boolean, default: true },
    faq: [{}],
    howToUse: { type: String },
    benefits: { type: String },
    nutritionalFacts: [{}],
});

productSchema.plugin(AutoIncrement, {
    id: "productId",
    inc_field: "id",
});

productSchema.index({ _id: -1, id: -1 });

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;