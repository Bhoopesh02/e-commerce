(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/cart/CartDrawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CartDrawer",
    ()=>CartDrawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Drawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Drawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCartStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatPrice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.mjs [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.mjs [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.mjs [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const CartDrawer = ()=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, appliedCoupon, discountAmount, couponError, applyCouponCode, removeCoupon, getSubtotal, getTax, getDeliveryFee, getTotal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    const [couponInput, setCouponInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isApplyingCoupon, setIsApplyingCoupon] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const subtotal = getSubtotal();
    const tax = getTax();
    const delivery = getDeliveryFee();
    const total = getTotal();
    const handleApplyCoupon = async (e)=>{
        e.preventDefault();
        if (!couponInput.trim()) return;
        setIsApplyingCoupon(true);
        await applyCouponCode(couponInput);
        setIsApplyingCoupon(false);
    };
    const handleProceedToCheckout = ()=>{
        closeDrawer();
        router.push('/checkout');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Drawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Drawer"], {
        isOpen: isDrawerOpen,
        onClose: closeDrawer,
        title: "Your Atelier Bag",
        width: "480px",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            },
            children: items.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70%',
                    textAlign: 'center',
                    padding: '32px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: 64,
                            height: 64,
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'rgba(243, 159, 90, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '20px',
                            color: 'var(--cta-primary)'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                            size: 28
                        }, void 0, false, {
                            fileName: "[project]/src/components/cart/CartDrawer.tsx",
                            lineNumber: 81,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 68,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        style: {
                            fontSize: '1.35rem',
                            marginBottom: '8px'
                        },
                        children: "Your Bag is Empty"
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 83,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        style: {
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            marginBottom: '24px'
                        },
                        children: "Explore our latest curated silhouettes from the Milan and Florentine ateliers."
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>{
                            closeDrawer();
                            router.push('/shop');
                        },
                        variant: "primary",
                        children: "Explore Collections"
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 87,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                lineNumber: 57,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            paddingRight: '6px',
                            marginBottom: '24px'
                        },
                        children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    gap: '16px',
                                    paddingBottom: '20px',
                                    borderBottom: '1px solid var(--border-light)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'relative',
                                            width: '90px',
                                            height: '115px',
                                            borderRadius: 'var(--radius-sm)',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            backgroundColor: 'var(--bg-primary)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: item.product.images[0],
                                            alt: item.product.name,
                                            fill: true,
                                            sizes: "100px",
                                            style: {
                                                objectFit: 'cover'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                            lineNumber: 132,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 121,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/product/${item.product.slug}`,
                                                        onClick: closeDrawer,
                                                        style: {
                                                            fontSize: '0.95rem',
                                                            fontWeight: 600,
                                                            color: 'var(--text-primary)',
                                                            lineHeight: 1.3
                                                        },
                                                        children: item.product.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                        lineNumber: 143,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>removeItem(item.sku),
                                                        style: {
                                                            color: 'var(--text-muted)',
                                                            padding: '2px'
                                                        },
                                                        "aria-label": `Remove ${item.product.name}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                            size: 15
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                            lineNumber: 160,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                        lineNumber: 155,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 142,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: '0.8rem',
                                                    color: 'var(--text-muted)',
                                                    marginTop: '4px'
                                                },
                                                children: [
                                                    "Size: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                        style: {
                                                            color: 'var(--text-primary)'
                                                        },
                                                        children: item.size
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 29
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " · Color: ",
                                                    item.color
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 164,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    marginTop: 'auto',
                                                    paddingTop: '10px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            border: '1px solid var(--border-color)',
                                                            borderRadius: 'var(--radius-pill)',
                                                            padding: '2px 8px',
                                                            gap: '10px'
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>updateQuantity(item.sku, item.quantity - 1),
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                "aria-label": "Decrease quantity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                                    lineNumber: 193,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                                lineNumber: 188,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    fontSize: '0.85rem',
                                                                    fontWeight: 600,
                                                                    minWidth: '16px',
                                                                    textAlign: 'center'
                                                                },
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                                lineNumber: 195,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>updateQuantity(item.sku, item.quantity + 1),
                                                                style: {
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    color: 'var(--text-muted)'
                                                                },
                                                                "aria-label": "Increase quantity",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    size: 12
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                                    lineNumber: 203,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '0.95rem',
                                                            fontWeight: 600,
                                                            color: 'var(--text-primary)'
                                                        },
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(item.price * item.quantity)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 168,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 141,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.sku, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 112,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 100,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: '20px'
                        },
                        children: [
                            appliedCoupon ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px 14px',
                                    backgroundColor: 'var(--color-success-bg)',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--color-success)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                size: 16,
                                                style: {
                                                    color: 'var(--color-success)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 231,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.82rem',
                                                    fontWeight: 600,
                                                    color: 'var(--color-success)'
                                                },
                                                children: [
                                                    appliedCoupon.code,
                                                    " applied (-",
                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(discountAmount),
                                                    ")"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 232,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 230,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: removeCoupon,
                                        style: {
                                            fontSize: '0.75rem',
                                            color: 'var(--color-error)',
                                            textDecoration: 'underline'
                                        },
                                        children: "Remove"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 236,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 219,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleApplyCoupon,
                                style: {
                                    display: 'flex',
                                    gap: '8px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '8px 12px',
                                            backgroundColor: 'var(--bg-surface)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                                size: 15,
                                                style: {
                                                    color: 'var(--text-muted)',
                                                    marginRight: '8px'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 256,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Privilege Code (e.g. WELCOME10)",
                                                value: couponInput,
                                                onChange: (e)=>setCouponInput(e.target.value.toUpperCase()),
                                                style: {
                                                    width: '100%',
                                                    fontSize: '0.82rem',
                                                    textTransform: 'uppercase'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                                lineNumber: 257,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 245,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "submit",
                                        variant: "outline",
                                        size: "sm",
                                        isLoading: isApplyingCoupon,
                                        disabled: !couponInput.trim(),
                                        children: "Apply"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 265,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 244,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            couponError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.78rem',
                                    color: 'var(--color-error)',
                                    marginTop: '6px'
                                },
                                children: couponError
                            }, void 0, false, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 278,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 217,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '18px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            border: '1px solid var(--border-color)',
                            marginBottom: '20px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.88rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Subtotal"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 298,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(subtotal)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 299,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 297,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            discountAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.88rem',
                                    color: 'var(--color-success)'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Privilege Discount"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 304,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "-",
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(discountAmount)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 305,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 303,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.88rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: "Estimated GST (5%)"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 310,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(tax)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 311,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 309,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.88rem'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--text-muted)'
                                        },
                                        children: "White-Glove Luxury Delivery"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 315,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--color-success)',
                                            fontWeight: 600
                                        },
                                        children: "Complimentary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderTop: '1px solid var(--border-light)',
                                    paddingTop: '12px',
                                    marginTop: '4px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 330,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            color: 'var(--color-sunset-700)'
                                        },
                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(total)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                        lineNumber: 331,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                                lineNumber: 319,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 285,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: handleProceedToCheckout,
                        variant: "primary",
                        size: "lg",
                        fullWidth: true,
                        rightIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                            size: 16
                        }, void 0, false, {
                            fileName: "[project]/src/components/cart/CartDrawer.tsx",
                            lineNumber: 341,
                            columnNumber: 26
                        }, ("TURBOPACK compile-time value", void 0)),
                        children: "Proceed to Checkout"
                    }, void 0, false, {
                        fileName: "[project]/src/components/cart/CartDrawer.tsx",
                        lineNumber: 336,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/cart/CartDrawer.tsx",
                lineNumber: 98,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/cart/CartDrawer.tsx",
            lineNumber: 55,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/cart/CartDrawer.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CartDrawer, "SYApbeEYDD8UrFmptfrBXyITo/0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = CartDrawer;
var _c;
__turbopack_context__.k.register(_c, "CartDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layout/StorefrontLayoutWrapper.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StorefrontLayoutWrapper",
    ()=>StorefrontLayoutWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useStorefrontStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/navigation/Navbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/navigation/Footer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2f$CartDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/cart/CartDrawer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/search/SearchOverlay.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/Toast.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
const StorefrontLayoutWrapper = ({ storefrontId, children })=>{
    _s();
    const { initStorefront, setStorefront } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"])();
    const [isSearchOpen, setIsSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StorefrontLayoutWrapper.useEffect": ()=>{
            if (storefrontId) {
                setStorefront(storefrontId);
            } else {
                initStorefront();
            }
        }
    }["StorefrontLayoutWrapper.useEffect"], [
        storefrontId,
        setStorefront,
        initStorefront
    ]);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isHomePage = pathname === '/';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Navbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Navbar"], {
                onOpenSearch: ()=>setIsSearchOpen(true)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1
                },
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isHomePage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$navigation$2f$Footer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Footer"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 40,
                columnNumber: 22
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$cart$2f$CartDrawer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartDrawer"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$search$2f$SearchOverlay$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SearchOverlay"], {
                isOpen: isSearchOpen,
                onClose: ()=>setIsSearchOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Toast$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ToastContainer"], {}, void 0, false, {
                fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
                lineNumber: 45,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/StorefrontLayoutWrapper.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StorefrontLayoutWrapper, "WCZMb31J6sExN5NhdgV4FRBqIt8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = StorefrontLayoutWrapper;
var _c;
__turbopack_context__.k.register(_c, "StorefrontLayoutWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/navigation/Footer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Footer",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useStorefrontStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useAuthStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-right.mjs [app-client] (ecmascript) <export default as ArrowUpRight>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const Footer = ()=>{
    _s();
    const { storefront, toggleStorefront } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"])();
    const { role, loginAsCustomer, loginAsAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        style: {
            backgroundColor: 'var(--color-sunset-900)',
            color: '#FFF8F5',
            borderTop: '1px solid rgba(232, 188, 185, 0.2)',
            paddingTop: '80px',
            paddingBottom: '40px',
            marginTop: 'auto'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '48px',
                        marginBottom: '64px'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                maxWidth: '340px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontFamily: 'var(--font-display)',
                                        fontSize: '2rem',
                                        letterSpacing: '0.18em',
                                        marginBottom: '12px',
                                        color: '#FFF8F5'
                                    },
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRAND_NAME"]
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 37,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '0.88rem',
                                        color: 'var(--color-sunset-200)',
                                        lineHeight: 1.7,
                                        marginBottom: '24px'
                                    },
                                    children: [
                                        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRAND_TAGLINE"],
                                        ". Crafted between Milan, Tuscany, and Paris with traceable European materials and enduring silhouette integrity."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '14px 18px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                        border: '1px solid rgba(232, 188, 185, 0.25)'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginBottom: '8px'
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                    color: 'var(--color-sunset-400)'
                                                },
                                                children: "Active Storefront Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 76,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: '0.92rem',
                                                        fontWeight: 600
                                                    },
                                                    children: storefront === 'a' ? 'Storefront A (Editorial)' : 'Storefront B (Refined)'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleStorefront,
                                                    style: {
                                                        fontSize: '0.75rem',
                                                        color: 'var(--color-sunset-400)',
                                                        textDecoration: 'underline',
                                                        cursor: 'pointer'
                                                    },
                                                    children: [
                                                        "Switch to ",
                                                        storefront === 'a' ? 'Refined' : 'Editorial'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                                    lineNumber: 84,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 60,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 36,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: '0.82rem',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-sunset-200)',
                                        marginBottom: '20px'
                                    },
                                    children: "Collections"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    style: {
                                        listStyle: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop?categorySlug=outerwear",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Outerwear & Coats"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 114,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop?categorySlug=tailoring",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Bespoke Tailoring"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 119,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop?categorySlug=eveningwear",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Silk Eveningwear"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 124,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 123,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop?categorySlug=knitwear",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Cashmere Knitwear"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 129,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 128,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/shop?categorySlug=leather-goods",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Hand-Finished Leather"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 133,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: '0.82rem',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-sunset-200)',
                                        marginBottom: '20px'
                                    },
                                    children: "Client Concierge"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    style: {
                                        listStyle: 'none',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '12px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/account",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Private Client Account"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/account/support",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Bespoke Inquiries & Support"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 160,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/offers",
                                                style: {
                                                    fontSize: '0.9rem',
                                                    color: '#E8BCB9'
                                                },
                                                children: "Seasonal Privileges"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(232, 188, 185, 0.7)'
                                                },
                                                children: "Dispatches via Email Only"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(232, 188, 185, 0.7)'
                                                },
                                                children: "7-Day Delivery Return Window"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Footer.tsx",
                                                lineNumber: 176,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 175,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    style: {
                                        fontSize: '0.82rem',
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        color: 'var(--color-sunset-200)',
                                        marginBottom: '20px'
                                    },
                                    children: "Role & Portal Access"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 185,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '0.85rem',
                                        color: '#E8BCB9',
                                        marginBottom: '16px',
                                        lineHeight: 1.6
                                    },
                                    children: [
                                        "Current actor is ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: role.toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 197,
                                            columnNumber: 32
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        ". Switch roles below to test client vs admin controls:"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: loginAsCustomer,
                                            style: {
                                                textAlign: 'left',
                                                padding: '8px 14px',
                                                borderRadius: 'var(--radius-sm)',
                                                backgroundColor: role === 'customer' ? 'var(--color-sunset-600)' : 'rgba(255, 255, 255, 0.08)',
                                                color: '#FFF',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            },
                                            children: "✓ View as Customer (Ayesha Rahman)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 200,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: loginAsAdmin,
                                            style: {
                                                textAlign: 'left',
                                                padding: '8px 14px',
                                                borderRadius: 'var(--radius-sm)',
                                                backgroundColor: role === 'admin' ? 'var(--color-sunset-600)' : 'rgba(255, 255, 255, 0.08)',
                                                color: '#FFF',
                                                fontSize: '0.82rem',
                                                fontWeight: 500,
                                                cursor: 'pointer'
                                            },
                                            children: "✓ View as Admin (Marcus Vance)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 215,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        role === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/admin/dashboard",
                                            style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.85rem',
                                                color: 'var(--color-sunset-400)',
                                                fontWeight: 600,
                                                marginTop: '4px'
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                " Open Admin Operations Panel ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpRight$3e$__["ArrowUpRight"], {
                                                    size: 14
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                                    lineNumber: 244,
                                                    columnNumber: 68
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/navigation/Footer.tsx",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 199,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/navigation/Footer.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        borderTop: '1px solid rgba(232, 188, 185, 0.15)',
                        paddingTop: '28px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        fontSize: '0.8rem',
                        color: 'rgba(232, 188, 185, 0.7)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                "© ",
                                new Date().getFullYear(),
                                " ",
                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRAND_NAME"],
                                " Atelier. All rights reserved. Prices in Indian Rupees (INR ₹)."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '24px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Complimentary Insured Courier"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Adyen Drop-In Payment Architecture"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "AWS Cognito Authentication"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Footer.tsx",
                                    lineNumber: 271,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/navigation/Footer.tsx",
                            lineNumber: 268,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/navigation/Footer.tsx",
                    lineNumber: 252,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/navigation/Footer.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/navigation/Footer.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Footer, "1OvpjfAUorvFRJHoONeSv/jNAc4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/navigation/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.mjs [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.mjs [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.mjs [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCartStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useWishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useWishlistStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useStorefrontStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useAuthStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
const Navbar = ({ onOpenSearch })=>{
    _s();
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { getCartItemCount, openDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    const { productIds } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useWishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlistStore"])();
    const { storefront } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const cartCount = getCartItemCount();
    const wishlistCount = productIds.length;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            let rafId = null;
            const handleScroll = {
                "Navbar.useEffect.handleScroll": ()=>{
                    if (rafId !== null) return;
                    rafId = requestAnimationFrame({
                        "Navbar.useEffect.handleScroll": ()=>{
                            const y = window.scrollY;
                            // Hysteresis: activate above 48px, deactivate only below 16px to prevent threshold flapping
                            setIsScrolled({
                                "Navbar.useEffect.handleScroll": (prev)=>{
                                    if (!prev && y > 48) return true;
                                    if (prev && y < 16) return false;
                                    return prev;
                                }
                            }["Navbar.useEffect.handleScroll"]);
                            rafId = null;
                        }
                    }["Navbar.useEffect.handleScroll"]);
                }
            }["Navbar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "Navbar.useEffect": ()=>{
                    window.removeEventListener('scroll', handleScroll);
                    if (rafId !== null) cancelAnimationFrame(rafId);
                }
            })["Navbar.useEffect"];
        }
    }["Navbar.useEffect"], []);
    const shopHref = '/shop';
    const newArrivalsHref = '/shop?tag=new-arrival';
    const accountHref = user?.role === 'admin' ? '/admin/dashboard' : '/account';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    transition: 'background-color 350ms var(--ease-luxury), border-color 350ms var(--ease-luxury), box-shadow 350ms var(--ease-luxury), backdrop-filter 350ms var(--ease-luxury), -webkit-backdrop-filter 350ms var(--ease-luxury)',
                    backgroundColor: isScrolled ? 'var(--nav-backdrop)' : 'transparent',
                    backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
                    WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
                    borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
                    boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
                    color: 'var(--text-primary)',
                    willChange: 'background-color, border-color, box-shadow, backdrop-filter',
                    transform: 'translateZ(0)'
                },
                className: "jsx-77361617cd7f8a8e",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            alignItems: 'center',
                            height: '76px'
                        },
                        className: "jsx-77361617cd7f8a8e" + " " + "container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    justifySelf: 'start',
                                    display: 'flex',
                                    alignItems: 'center'
                                },
                                className: "jsx-77361617cd7f8a8e",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'inherit'
                                        },
                                        "aria-label": "Toggle Navigation Menu",
                                        className: "jsx-77361617cd7f8a8e" + " " + "mobile-nav-toggle",
                                        children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            size: 24
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Navbar.tsx",
                                            lineNumber: 101,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            size: 24
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Navbar.tsx",
                                            lineNumber: 101,
                                            columnNumber: 51
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        style: {
                                            display: 'none',
                                            alignItems: 'center',
                                            gap: '32px'
                                        },
                                        className: "jsx-77361617cd7f8a8e" + " " + "desktop-nav-links",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                className: "nav-link-expand",
                                                style: {
                                                    fontSize: '0.82rem',
                                                    fontWeight: 500,
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase'
                                                },
                                                children: "Home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 113,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: shopHref,
                                                className: "nav-link-expand",
                                                style: {
                                                    fontSize: '0.82rem',
                                                    fontWeight: 500,
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase'
                                                },
                                                children: "Collections"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: newArrivalsHref,
                                                className: "nav-link-expand",
                                                style: {
                                                    fontSize: '0.82rem',
                                                    fontWeight: 500,
                                                    letterSpacing: '0.12em',
                                                    textTransform: 'uppercase'
                                                },
                                                children: "New Arrivals"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 105,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    justifySelf: 'center',
                                    textAlign: 'center'
                                },
                                className: "jsx-77361617cd7f8a8e",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    style: {
                                        display: 'inline-block'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '1.75rem',
                                            fontWeight: 600,
                                            letterSpacing: '0.22em',
                                            color: 'var(--text-primary)',
                                            display: 'inline-block',
                                            transform: isScrolled ? 'scale(0.92)' : 'scale(1)',
                                            transition: 'transform 350ms var(--ease-luxury)',
                                            willChange: 'transform',
                                            textTransform: 'uppercase'
                                        },
                                        className: "jsx-77361617cd7f8a8e",
                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRAND_NAME"]
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/navigation/Navbar.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    justifySelf: 'end',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                },
                                className: "jsx-77361617cd7f8a8e",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onOpenSearch,
                                        "aria-label": "Search Collection",
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'inherit'
                                        },
                                        className: "jsx-77361617cd7f8a8e",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            size: 19
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Navbar.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 188,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/wishlist",
                                        "aria-label": "Wishlist",
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            color: 'inherit'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                                size: 19
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 213,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            wishlistCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-8px',
                                                    backgroundColor: 'var(--color-sunset-600)',
                                                    color: '#FFF',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                className: "jsx-77361617cd7f8a8e",
                                                children: wishlistCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 215,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 202,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: accountHref,
                                        "aria-label": user?.role === 'admin' ? 'Admin Control' : 'Account',
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'inherit'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                            size: 19
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/navigation/Navbar.tsx",
                                            lineNumber: 248,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 238,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: openDrawer,
                                        "aria-label": "Shopping Bag",
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            color: 'inherit'
                                        },
                                        className: "jsx-77361617cd7f8a8e",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                                size: 19
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 263,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            cartCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    position: 'absolute',
                                                    top: '-6px',
                                                    right: '-8px',
                                                    backgroundColor: 'var(--cta-primary)',
                                                    color: 'var(--cta-text)',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 700,
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: 'var(--radius-pill)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                },
                                                className: "jsx-77361617cd7f8a8e",
                                                children: cartCount
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                                lineNumber: 265,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                                        lineNumber: 252,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 175,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '24px',
                            backgroundColor: 'var(--bg-surface)',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        },
                        className: "jsx-77361617cd7f8a8e",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                onClick: ()=>setMobileMenuOpen(false),
                                style: {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                },
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 301,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: shopHref,
                                onClick: ()=>setMobileMenuOpen(false),
                                style: {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                },
                                children: "Collections"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 308,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: newArrivalsHref,
                                onClick: ()=>setMobileMenuOpen(false),
                                style: {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                },
                                children: "New Arrivals"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 315,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/offers",
                                onClick: ()=>setMobileMenuOpen(false),
                                style: {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                },
                                children: "Private Client Offers"
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 322,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: accountHref,
                                onClick: ()=>setMobileMenuOpen(false),
                                style: {
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    letterSpacing: '0.08em'
                                },
                                children: user?.role === 'admin' ? 'Admin Portal' : 'My Account'
                            }, void 0, false, {
                                fileName: "[project]/src/components/navigation/Navbar.tsx",
                                lineNumber: 329,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/navigation/Navbar.tsx",
                        lineNumber: 291,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/navigation/Navbar.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "77361617cd7f8a8e",
                children: "@media (width>=768px){.mobile-nav-toggle{display:none!important}.desktop-nav-links{display:flex!important}}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/navigation/Navbar.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "1QPQBIvEYsyo1OYhCKfRJVvw7og=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useWishlistStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWishlistStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useStorefrontStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStorefrontStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useAuthStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/search/SearchOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SearchOverlay",
    ()=>SearchOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useCartStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/formatPrice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const ROTATING_QUERIES = [
    "Cashmere Coat",
    "Mulberry Silk Gown",
    "Double-Breasted Wool",
    "Tuscan Leather Chelsea",
    "Sculptural Gold Cuff"
];
const SUGGESTIONS = [
    "Italian Leather",
    "Double-Breasted",
    "Silk Gown",
    "Cashmere",
    "Goodyear Chelsea",
    "Gold Vermeil"
];
const SearchOverlay = ({ isOpen, onClose })=>{
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [placeholderIdx, setPlaceholderIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [addedMap, setAddedMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { addItem } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"])();
    // Rotating placeholder cycle every 2.5s when query is empty
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchOverlay.useEffect": ()=>{
            if (!isOpen || query) return;
            const interval = setInterval({
                "SearchOverlay.useEffect.interval": ()=>{
                    setPlaceholderIdx({
                        "SearchOverlay.useEffect.interval": (prev)=>(prev + 1) % ROTATING_QUERIES.length
                    }["SearchOverlay.useEffect.interval"]);
                }
            }["SearchOverlay.useEffect.interval"], 2500);
            return ({
                "SearchOverlay.useEffect": ()=>clearInterval(interval)
            })["SearchOverlay.useEffect"];
        }
    }["SearchOverlay.useEffect"], [
        isOpen,
        query
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchOverlay.useEffect": ()=>{
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                setTimeout({
                    "SearchOverlay.useEffect": ()=>inputRef.current?.focus()
                }["SearchOverlay.useEffect"], 150);
            } else {
                document.body.style.overflow = '';
            }
            const handleKeyDown = {
                "SearchOverlay.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["SearchOverlay.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "SearchOverlay.useEffect": ()=>{
                    document.body.style.overflow = '';
                    window.removeEventListener('keydown', handleKeyDown);
                }
            })["SearchOverlay.useEffect"];
        }
    }["SearchOverlay.useEffect"], [
        isOpen,
        onClose
    ]);
    // Reset local state when drawer closes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchOverlay.useEffect": ()=>{
            if (!isOpen) {
                const t = setTimeout({
                    "SearchOverlay.useEffect.t": ()=>{
                        setQuery('');
                        setResults([]);
                    }
                }["SearchOverlay.useEffect.t"], 600); // wait for close animation (backdrop completes at 550ms)
                return ({
                    "SearchOverlay.useEffect": ()=>clearTimeout(t)
                })["SearchOverlay.useEffect"];
            }
        }
    }["SearchOverlay.useEffect"], [
        isOpen
    ]);
    // Fetch results based on query or default to new-arrival/featured products
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchOverlay.useEffect": ()=>{
            const timer = setTimeout({
                "SearchOverlay.useEffect.timer": async ()=>{
                    setIsLoading(true);
                    try {
                        if (!query.trim()) {
                            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProducts"])({
                                tag: 'new-arrival'
                            });
                            setResults(data.slice(0, 4)); // limit to 4 items for the drawer
                        } else {
                            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProducts"])({
                                searchQuery: query
                            });
                            setResults(data);
                        }
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["SearchOverlay.useEffect.timer"], 200);
            return ({
                "SearchOverlay.useEffect": ()=>clearTimeout(timer)
            })["SearchOverlay.useEffect"];
        }
    }["SearchOverlay.useEffect"], [
        query
    ]);
    const handleQuickAdd = (product)=>{
        const defaultVariant = product.variants?.[0];
        const sku = defaultVariant ? defaultVariant.sku : product.id;
        const size = defaultVariant ? defaultVariant.size : 'OS';
        const color = defaultVariant ? defaultVariant.color : 'Default';
        addItem(product, sku, size, color, 1);
        setAddedMap((prev)=>({
                ...prev,
                [product.id]: true
            }));
        setTimeout(()=>{
            setAddedMap((prev)=>({
                    ...prev,
                    [product.id]: false
                }));
        }, 1500);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            transition: 'opacity 550ms var(--ease-luxury)',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: onClose,
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)'
                }
            }, void 0, false, {
                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                style: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '100%',
                    maxWidth: '460px',
                    backgroundColor: '#141021',
                    color: '#f5f5f5',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 450ms var(--ease-luxury)'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '24px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#19142b'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: onClose,
                                        style: {
                                            padding: '6px',
                                            color: '#a3a3a3',
                                            borderRadius: '50%',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        },
                                        onMouseOver: (e)=>e.currentTarget.style.color = '#fff',
                                        onMouseOut: (e)=>e.currentTarget.style.color = '#a3a3a3',
                                        "aria-label": "Back",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 167,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'relative',
                                            flex: 1
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                size: 16,
                                                style: {
                                                    color: 'rgba(252, 211, 77, 0.8)',
                                                    position: 'absolute',
                                                    left: '12px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)'
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 188,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                ref: inputRef,
                                                type: "text",
                                                value: query,
                                                onChange: (e)=>setQuery(e.target.value),
                                                placeholder: `Search for "${ROTATING_QUERIES[placeholderIdx]}"`,
                                                style: {
                                                    width: '100%',
                                                    padding: '8px 32px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                    color: '#f5f5f5',
                                                    fontSize: '0.875rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                                    outline: 'none',
                                                    transition: 'border-color 200ms, background-color 200ms'
                                                },
                                                onFocus: (e)=>{
                                                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                                },
                                                onBlur: (e)=>{
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setQuery(''),
                                                style: {
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    color: '#a3a3a3',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    cursor: 'pointer'
                                                },
                                                onMouseOver: (e)=>e.currentTarget.style.color = '#fff',
                                                onMouseOut: (e)=>e.currentTarget.style.color = '#a3a3a3',
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 225,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                lineNumber: 166,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: '20px'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            display: 'block',
                                            fontSize: '10px',
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            letterSpacing: '0.1em',
                                            color: 'rgba(253, 230, 138, 0.7)',
                                            marginBottom: '8px'
                                        },
                                        children: "Suggested Explorations"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '6px'
                                        },
                                        children: SUGGESTIONS.map((tag)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setQuery(tag),
                                                style: {
                                                    fontSize: '12px',
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                                    backgroundColor: '#201a37',
                                                    color: '#d4d4d4',
                                                    cursor: 'pointer',
                                                    transition: 'all 200ms'
                                                },
                                                onMouseOver: (e)=>{
                                                    e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.6)';
                                                    e.currentTarget.style.color = '#fde68a';
                                                },
                                                onMouseOut: (e)=>{
                                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                    e.currentTarget.style.color = '#d4d4d4';
                                                },
                                                children: tag
                                            }, tag, false, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 263,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                        lineNumber: 165,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            flex: 1,
                            overflowY: 'auto',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#e5e5e5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            margin: 0
                                        },
                                        children: [
                                            !query.trim() ? "What's New" : "Search Results",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    color: '#fbbf24',
                                                    fontFamily: 'var(--font-display)'
                                                },
                                                children: "★"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 296,
                                                columnNumber: 65
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 295,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: '11px',
                                            fontFamily: 'monospace',
                                            color: '#a3a3a3'
                                        },
                                        children: isLoading ? '...' : `${results.length} Items`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                lineNumber: 294,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '14px'
                                },
                                children: results.map((item)=>{
                                    const isAdded = !!addedMap[item.id];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'relative',
                                            borderRadius: '12px',
                                            backgroundColor: '#1d1733',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            transition: 'all 200ms'
                                        },
                                        onMouseOver: (e)=>{
                                            e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)';
                                        },
                                        onMouseOut: (e)=>{
                                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/product/${item.slug}`,
                                                onClick: onClose,
                                                style: {
                                                    textDecoration: 'none'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            position: 'relative',
                                                            aspectRatio: '1/1',
                                                            width: '100%',
                                                            borderRadius: '8px',
                                                            overflow: 'hidden',
                                                            backgroundColor: 'rgba(0,0,0,0.4)',
                                                            marginBottom: '8px'
                                                        },
                                                        children: [
                                                            (item.featured || item.isNewArrival) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                style: {
                                                                    position: 'absolute',
                                                                    top: '6px',
                                                                    left: '6px',
                                                                    zIndex: 10,
                                                                    fontSize: '9px',
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.05em',
                                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                                    backdropFilter: 'blur(4px)',
                                                                    color: '#fde68a',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                                },
                                                                children: item.isNewArrival ? 'New Season' : 'Featured'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                                lineNumber: 330,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: item.images[0],
                                                                alt: item.name,
                                                                fill: true,
                                                                sizes: "200px",
                                                                style: {
                                                                    objectFit: 'cover'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                        lineNumber: 328,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: '10px',
                                                            color: 'rgba(253, 230, 138, 0.6)',
                                                            textTransform: 'uppercase',
                                                            fontFamily: 'monospace',
                                                            letterSpacing: '0.05em',
                                                            display: 'block'
                                                        },
                                                        children: item.categoryId.replace('cat_', '')
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        style: {
                                                            fontFamily: 'var(--font-display)',
                                                            fontSize: '12px',
                                                            color: '#e5e5e5',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            marginTop: '2px',
                                                            lineHeight: '1.2'
                                                        },
                                                        children: item.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                        lineNumber: 360,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 327,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    marginTop: '12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontFamily: 'var(--font-display)',
                                                            fontSize: '0.875rem',
                                                            fontWeight: 600,
                                                            color: '#f5f5f5',
                                                            display: 'block',
                                                            marginBottom: '8px'
                                                        },
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$formatPrice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatPrice"])(item.price)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: (e)=>{
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleQuickAdd(item);
                                                        },
                                                        style: {
                                                            width: '100%',
                                                            padding: '6px',
                                                            borderRadius: '8px',
                                                            fontSize: '12px',
                                                            fontWeight: 600,
                                                            letterSpacing: '0.05em',
                                                            transition: 'all 200ms',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            gap: '4px',
                                                            cursor: 'pointer',
                                                            backgroundColor: isAdded ? '#059669' : '#7c1d35',
                                                            color: '#ffffff',
                                                            border: 'none',
                                                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                                                        },
                                                        onMouseOver: (e)=>{
                                                            if (!isAdded) e.currentTarget.style.backgroundColor = '#631427';
                                                        },
                                                        onMouseOut: (e)=>{
                                                            if (!isAdded) e.currentTarget.style.backgroundColor = '#7c1d35';
                                                        },
                                                        children: isAdded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                                    lineNumber: 402,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " Added"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                            lineNumber: 401,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                    size: 14
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                                    lineNumber: 406,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                " ADD"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                            lineNumber: 405,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                        lineNumber: 369,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                        lineNumber: 307,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#19142b',
                            textAlign: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/shop",
                            onClick: onClose,
                            style: {
                                fontSize: '12px',
                                color: '#fde68a',
                                textDecoration: 'underline',
                                letterSpacing: '0.05em',
                                fontWeight: 500
                            },
                            onMouseOver: (e)=>e.currentTarget.style.color = '#fff',
                            onMouseOut: (e)=>e.currentTarget.style.color = '#fde68a',
                            children: "Explore Full Aurelia Catalogue →"
                        }, void 0, false, {
                            fileName: "[project]/src/components/search/SearchOverlay.tsx",
                            lineNumber: 419,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/search/SearchOverlay.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/search/SearchOverlay.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/search/SearchOverlay.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SearchOverlay, "TH7dXAEh2LPeEijyra4DtO0W2UI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useCartStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCartStore"]
    ];
});
_c = SearchOverlay;
var _c;
__turbopack_context__.k.register(_c, "SearchOverlay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.mjs [app-client] (ecmascript) <export default as Loader2>");
'use client';
;
;
;
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef(_c = ({ children, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, fullWidth = false, className = '', disabled, style, ...props }, ref)=>{
    // Luxury styled button styles using CSS variables
    const baseStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: 'var(--radius-pill)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.95rem' : '0.85rem',
        padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 36px' : '12px 26px',
        transition: 'all var(--duration-normal) var(--ease-editorial)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled || isLoading ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid transparent'
    };
    let variantStyle = {};
    switch(variant){
        case 'primary':
            variantStyle = {
                backgroundColor: 'var(--cta-primary)',
                color: 'var(--cta-text)',
                boxShadow: 'var(--shadow-sm)'
            };
            break;
        case 'secondary':
            variantStyle = {
                backgroundColor: 'var(--color-sunset-900)',
                color: 'var(--color-white)'
            };
            break;
        case 'outline':
            variantStyle = {
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)'
            };
            break;
        case 'ghost':
            variantStyle = {
                backgroundColor: 'transparent',
                color: 'var(--text-primary)'
            };
            break;
        case 'danger':
            variantStyle = {
                backgroundColor: 'var(--color-error)',
                color: 'var(--color-white)'
            };
            break;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        ref: ref,
        disabled: disabled || isLoading,
        style: {
            ...baseStyle,
            ...variantStyle,
            ...style
        },
        className: `luxury-btn luxury-btn-${variant} ${className}`,
        ...props,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
            className: "animate-spin",
            size: 16
        }, void 0, false, {
            fileName: "[project]/src/components/ui/Button.tsx",
            lineNumber: 104,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                leftIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "luxury-btn-icon luxury-btn-icon-left",
                    children: leftIcon
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 107,
                    columnNumber: 26
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "luxury-btn-label",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 108,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                rightIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "luxury-btn-icon luxury-btn-icon-right",
                    children: rightIcon
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Button.tsx",
                    lineNumber: 109,
                    columnNumber: 27
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/Button.tsx",
            lineNumber: 106,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Button.tsx",
        lineNumber: 96,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = 'Button';
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Drawer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Drawer",
    ()=>Drawer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const Drawer = ({ isOpen, onClose, title, children, position = 'right', width = '440px', ariaLabel })=>{
    _s();
    const generatedId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useId();
    const titleId = `drawer-title-${generatedId.replace(/:/g, '')}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Drawer.useEffect": ()=>{
            const handleKeyDown = {
                "Drawer.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape') onClose();
                }
            }["Drawer.useEffect.handleKeyDown"];
            if (isOpen) {
                document.body.style.overflow = 'hidden';
                window.addEventListener('keydown', handleKeyDown);
            } else {
                document.body.style.overflow = '';
            }
            return ({
                "Drawer.useEffect": ()=>{
                    document.body.style.overflow = '';
                    window.removeEventListener('keydown', handleKeyDown);
                }
            })["Drawer.useEffect"];
        }
    }["Drawer.useEffect"], [
        isOpen,
        onClose
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": isOpen,
        "aria-hidden": !isOpen,
        "aria-labelledby": title ? titleId : undefined,
        "aria-label": ariaLabel || (!title ? 'Drawer' : undefined),
        style: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(29, 26, 57, 0.55)',
            backdropFilter: 'blur(6px)',
            zIndex: 9998,
            display: 'flex',
            justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: isOpen ? 'opacity 500ms var(--ease-luxury) 50ms' : 'opacity 500ms var(--ease-luxury)'
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                width: '100%',
                maxWidth: width,
                height: '100%',
                backgroundColor: 'var(--bg-surface)',
                borderLeft: position === 'right' ? '1px solid var(--border-color)' : 'none',
                borderRight: position === 'left' ? '1px solid var(--border-color)' : 'none',
                boxShadow: 'var(--shadow-editorial)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
                transition: 'transform 500ms var(--ease-luxury)'
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        padding: '20px 24px',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    },
                    children: [
                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            id: titleId,
                            style: {
                                fontSize: '1.25rem',
                                color: 'var(--text-primary)'
                            },
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Drawer.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            "aria-label": "Close drawer",
                            style: {
                                marginLeft: 'auto',
                                color: 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 32,
                                height: 32,
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--border-light)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/Drawer.tsx",
                                lineNumber: 118,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Drawer.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/Drawer.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        flex: 1,
                        overflowY: 'auto',
                        padding: '24px'
                    },
                    children: children
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/Drawer.tsx",
                    lineNumber: 122,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/Drawer.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Drawer.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Drawer, "BGwEz1bNcViOD63AoxN7u3ZHQu0=");
_c = Drawer;
var _c;
__turbopack_context__.k.register(_c, "Drawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/Toast.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ToastContainer",
    ()=>ToastContainer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useToastStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/store/useToastStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.mjs [app-client] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const ToastContainer = ()=>{
    _s();
    const { toasts, removeToast } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useToastStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastStore"])();
    if (toasts.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '420px'
        },
        children: toasts.map((toast)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                role: "alert",
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'var(--bg-surface-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 18px',
                    boxShadow: 'var(--shadow-lg)',
                    animation: 'toastSlideUp 400ms var(--ease-luxury)'
                },
                children: [
                    toast.type === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                        size: 18,
                        style: {
                            color: 'var(--color-success)',
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Toast.tsx",
                        lineNumber: 43,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    toast.type === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                        size: 18,
                        style: {
                            color: 'var(--color-error)',
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Toast.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    toast.type === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                        size: 18,
                        style: {
                            color: 'var(--color-info)',
                            flexShrink: 0
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Toast.tsx",
                        lineNumber: 49,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        style: {
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            flex: 1
                        },
                        children: toast.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Toast.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>removeToast(toast.id),
                        style: {
                            color: 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center'
                        },
                        "aria-label": "Dismiss toast",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            size: 15
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/Toast.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Toast.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, toast.id, true, {
                fileName: "[project]/src/components/ui/Toast.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/Toast.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ToastContainer, "RP9yod1mxc3cnvYNuij1n7b+wGU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$store$2f$useToastStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useToastStore"]
    ];
});
_c = ToastContainer;
var _c;
__turbopack_context__.k.register(_c, "ToastContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/banners.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "ban_001",
        "image": "/images/banners/banner-autumn-winter.webp",
        "headline": "The Autumn Atelier",
        "subheadline": "Vol. IV — Nocturnal Silhouettes & Sculptural Wool",
        "cta": "Explore the Campaign",
        "linkTo": "/shop?categorySlug=outerwear",
        "active": true,
        "sortOrder": 1,
        "storefront": "a"
    },
    {
        "id": "ban_002",
        "image": "/images/banners/banner-eveningwear.webp",
        "headline": "Modern Eveningwear",
        "subheadline": "Liquid Charmeuse & Asymmetric Architecture",
        "cta": "View Selection",
        "linkTo": "/shop?categorySlug=eveningwear",
        "active": true,
        "sortOrder": 2,
        "storefront": "a"
    },
    {
        "id": "ban_003",
        "image": "/images/banners/banner-permanent-wardrobe.webp",
        "headline": "The Permanent Wardrobe",
        "subheadline": "Essential Tailoring & Refined Cashmere",
        "cta": "Shop Collection",
        "linkTo": "/shop",
        "active": true,
        "sortOrder": 1,
        "storefront": "b"
    },
    {
        "id": "ban_004",
        "image": "/images/banners/banner-leather-goods.webp",
        "headline": "Artisanal Leather Goods",
        "subheadline": "Hand-stitched Tuscan Box Calfskin",
        "cta": "Discover Bags",
        "linkTo": "/shop?categorySlug=leather-goods",
        "active": true,
        "sortOrder": 2,
        "storefront": "b"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/categories.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "cat_outerwear",
        "name": "Outerwear",
        "slug": "outerwear",
        "description": "Architectural trench coats, double-faced wool overcoats, and Milanese leather jackets.",
        "visible": true,
        "image": "/images/categories/cat-outerwear.webp",
        "featuredOrder": 1
    },
    {
        "id": "cat_tailoring",
        "name": "Tailoring",
        "slug": "tailoring",
        "description": "Deconstructed suiting, structured Italian wool blazers, and sculptural pleated trousers.",
        "visible": true,
        "image": "/images/categories/cat-tailoring.webp",
        "featuredOrder": 2
    },
    {
        "id": "cat_eveningwear",
        "name": "Eveningwear",
        "slug": "eveningwear",
        "description": "Floor-sweeping silk gowns, draped satin ensembles, and nocturnal silhouette dresses.",
        "visible": true,
        "image": "/images/categories/cat-eveningwear.webp",
        "featuredOrder": 3
    },
    {
        "id": "cat_knitwear",
        "name": "Knitwear",
        "slug": "knitwear",
        "description": "Grade-A Mongolian cashmere, ribbed merino jumpers, and lightweight mohair layers.",
        "visible": true,
        "image": "/images/categories/cat-knitwear.webp",
        "featuredOrder": 4
    },
    {
        "id": "cat_leather_goods",
        "name": "Leather Goods",
        "slug": "leather-goods",
        "description": "Full-grain calfskin tote bags, sculptural saddle clutches, and hand-stitched travel luggage.",
        "visible": true,
        "image": "/images/categories/cat-leather-goods.webp",
        "featuredOrder": 5
    },
    {
        "id": "cat_footwear",
        "name": "Footwear",
        "slug": "footwear",
        "description": "Goodyear-welted Chelsea boots, minimalist architectural loafers, and Tuscan leather mules.",
        "visible": true,
        "image": "/images/categories/cat-footwear.webp",
        "featuredOrder": 6
    },
    {
        "id": "cat_jewelry",
        "name": "Fine Jewelry",
        "slug": "fine-jewelry",
        "description": "18k vermeil sculptural cuffs, baroque pearl pendants, and signet bands.",
        "visible": true,
        "image": "/images/categories/cat-jewelry.webp",
        "featuredOrder": 7
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/coupons.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "code": "WELCOME10",
        "type": "percentage",
        "value": 10,
        "expiryDate": "2026-12-31",
        "usageLimit": 500,
        "usedCount": 128,
        "minOrderValue": 5000,
        "maxDiscount": 3000,
        "active": true,
        "description": "10% privilege discount on orders above ₹5,000"
    },
    {
        "code": "AURELIAVIP",
        "type": "percentage",
        "value": 15,
        "expiryDate": "2026-12-31",
        "usageLimit": 200,
        "usedCount": 42,
        "minOrderValue": 15000,
        "maxDiscount": 6000,
        "active": true,
        "description": "15% private client privilege on orders above ₹15,000"
    },
    {
        "code": "ATELIER2500",
        "type": "fixed",
        "value": 2500,
        "expiryDate": "2026-12-31",
        "usageLimit": 300,
        "usedCount": 85,
        "minOrderValue": 12000,
        "active": true,
        "description": "Flat ₹2,500 complimentary reduction on orders above ₹12,000"
    },
    {
        "code": "EXPIRED20",
        "type": "percentage",
        "value": 20,
        "expiryDate": "2024-01-01",
        "usageLimit": 100,
        "usedCount": 100,
        "minOrderValue": 5000,
        "active": false,
        "description": "Seasonal archive coupon (inactive)"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/orders.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "ord_1001",
        "userId": "usr_001",
        "customerName": "Ayesha Rahman",
        "customerEmail": "ayesha@example.com",
        "items": [
            {
                "productId": "prod_001",
                "productName": "Italian Leather Jacket",
                "productImage": "/images/products/italian-leather-jacket-1.webp",
                "sku": "LJ-BLK-M",
                "size": "M",
                "color": "Nocturne Black",
                "quantity": 1,
                "price": 24999
            }
        ],
        "status": "Delivered",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-09-12T09:00:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            },
            {
                "status": "Confirmed",
                "timestamp": "2026-09-12T12:00:00Z",
                "note": "Payment verified. Being prepared by the atelier."
            },
            {
                "status": "Packed",
                "timestamp": "2026-09-13T10:00:00Z",
                "note": "Garment inspected and wrapped in archival tissue."
            },
            {
                "status": "Shipped",
                "timestamp": "2026-09-14T08:30:00Z",
                "note": "Dispatched via BlueDart white-glove courier."
            },
            {
                "status": "Delivered",
                "timestamp": "2026-09-16T14:15:00Z",
                "note": "Delivered and signed for at client address."
            }
        ],
        "address": {
            "id": "addr_1",
            "name": "Ayesha Rahman",
            "phone": "+91 98765 43210",
            "line1": "12 MG Road, Alwarpet",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600001",
            "isDefault": true
        },
        "payment": {
            "method": "UPI",
            "status": "successful",
            "transactionId": "TXN_UPI_982736192",
            "upiVpa": "ayesha@oksbi"
        },
        "totals": {
            "subtotal": 24999,
            "discount": 2500,
            "tax": 2250,
            "delivery": 0,
            "total": 24749
        },
        "trackingInfo": {
            "carrier": "BlueDart Express",
            "trackingId": "BD987654321IN",
            "estimatedDelivery": "2026-09-16",
            "trackingUrl": "https://bluedart.com/tracking/BD987654321IN"
        },
        "createdAt": "2026-09-12T09:00:00Z"
    },
    {
        "id": "ord_1002",
        "userId": "usr_001",
        "customerName": "Ayesha Rahman",
        "customerEmail": "ayesha@example.com",
        "items": [
            {
                "productId": "prod_003",
                "productName": "Silk Charmeuse Draped Evening Gown",
                "productImage": "/images/products/silk-charmeuse-draped-evening-gown-1.webp",
                "sku": "GWN-EMR-S",
                "size": "S",
                "color": "Deep Aubergine",
                "quantity": 1,
                "price": 38999
            }
        ],
        "status": "Placed",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-09-18T08:30:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            }
        ],
        "address": {
            "id": "addr_1",
            "name": "Ayesha Rahman",
            "phone": "+91 98765 43210",
            "line1": "12 MG Road, Alwarpet",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600001",
            "isDefault": true
        },
        "payment": {
            "method": "Card",
            "status": "successful",
            "transactionId": "TXN_CRD_384729103",
            "cardLast4": "4242"
        },
        "totals": {
            "subtotal": 38999,
            "discount": 3000,
            "tax": 3510,
            "delivery": 0,
            "total": 39509
        },
        "trackingInfo": {
            "carrier": "BlueDart Express",
            "trackingId": "Pending Dispatch",
            "estimatedDelivery": "2026-09-22"
        },
        "createdAt": "2026-09-18T08:30:00Z"
    },
    {
        "id": "ord_1003",
        "userId": "usr_002",
        "customerName": "Devika Mehra",
        "customerEmail": "devika@example.com",
        "items": [
            {
                "productId": "prod_005",
                "productName": "Atelier Sculptural Leather Tote",
                "productImage": "/images/products/atelier-sculptural-leather-tote-1.webp",
                "sku": "TOT-COG-ONE",
                "size": "One Size",
                "color": "Cognac Ochre",
                "quantity": 1,
                "price": 28999
            }
        ],
        "status": "Packed",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-09-17T11:00:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            },
            {
                "status": "Confirmed",
                "timestamp": "2026-09-17T14:30:00Z",
                "note": "Payment verified. Being prepared by the atelier."
            },
            {
                "status": "Packed",
                "timestamp": "2026-09-18T06:00:00Z",
                "note": "Garment inspected and wrapped in archival tissue."
            }
        ],
        "address": {
            "id": "addr_2",
            "name": "Devika Mehra",
            "phone": "+91 98111 22334",
            "line1": "Flat 4B, Regency Heights, Bandra West",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400050",
            "isDefault": true
        },
        "payment": {
            "method": "NetBanking",
            "status": "successful",
            "transactionId": "TXN_NB_771928341"
        },
        "totals": {
            "subtotal": 28999,
            "discount": 0,
            "tax": 2610,
            "delivery": 0,
            "total": 31609
        },
        "trackingInfo": {
            "carrier": "Delhivery Luxury Service",
            "trackingId": "DEL99281726",
            "estimatedDelivery": "2026-09-20"
        },
        "createdAt": "2026-09-17T11:00:00Z"
    },
    {
        "id": "ord_1004",
        "userId": "usr_003",
        "customerName": "Kabir Singhania",
        "customerEmail": "kabir@example.com",
        "items": [
            {
                "productId": "prod_002",
                "productName": "Sculpted Double-Breasted Blazer",
                "productImage": "/images/products/sculpted-double-breasted-blazer-1.webp",
                "sku": "BLZ-NAV-40",
                "size": "40R",
                "color": "Midnight Navy",
                "quantity": 1,
                "price": 18499
            }
        ],
        "status": "Delivered",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-08-01T10:00:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            },
            {
                "status": "Confirmed",
                "timestamp": "2026-08-01T13:00:00Z",
                "note": "Payment verified. Being prepared by the atelier."
            },
            {
                "status": "Packed",
                "timestamp": "2026-08-02T09:00:00Z",
                "note": "Garment inspected and wrapped in archival tissue."
            },
            {
                "status": "Shipped",
                "timestamp": "2026-08-03T11:00:00Z",
                "note": "Dispatched via BlueDart white-glove courier."
            },
            {
                "status": "Delivered",
                "timestamp": "2026-08-05T15:30:00Z",
                "note": "Delivered and signed for at client address."
            }
        ],
        "address": {
            "id": "addr_3",
            "name": "Kabir Singhania",
            "phone": "+91 98222 55443",
            "line1": "Villa 18, Golf Links",
            "city": "New Delhi",
            "state": "Delhi",
            "pincode": "110003",
            "isDefault": true
        },
        "payment": {
            "method": "COD",
            "status": "successful",
            "transactionId": "TXN_COD_11092834"
        },
        "totals": {
            "subtotal": 18499,
            "discount": 1000,
            "tax": 1665,
            "delivery": 0,
            "total": 19164
        },
        "trackingInfo": {
            "carrier": "BlueDart Express",
            "trackingId": "BD554433221IN",
            "estimatedDelivery": "2026-08-05"
        },
        "createdAt": "2026-08-01T10:00:00Z"
    },
    {
        "id": "ord_1005",
        "userId": "usr_001",
        "customerName": "Ayesha Rahman",
        "customerEmail": "ayesha@example.com",
        "items": [
            {
                "productId": "prod_004",
                "productName": "Mongolian Cashmere Ribbed Turtleneck",
                "productImage": "/images/products/mongolian-cashmere-ribbed-turtleneck-1.webp",
                "sku": "CSH-CRM-M",
                "size": "M",
                "color": "Warm Sand",
                "quantity": 1,
                "price": 14999
            }
        ],
        "status": "Shipped",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-09-15T10:30:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            },
            {
                "status": "Confirmed",
                "timestamp": "2026-09-15T13:00:00Z",
                "note": "Payment verified. Being prepared by the atelier."
            },
            {
                "status": "Packed",
                "timestamp": "2026-09-16T08:00:00Z",
                "note": "Garment inspected and wrapped in archival tissue."
            },
            {
                "status": "Shipped",
                "timestamp": "2026-09-17T09:15:00Z",
                "note": "Dispatched via Delhivery white-glove courier."
            }
        ],
        "address": {
            "id": "addr_1",
            "name": "Ayesha Rahman",
            "phone": "+91 98765 43210",
            "line1": "12 MG Road, Alwarpet",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600001",
            "isDefault": true
        },
        "payment": {
            "method": "UPI",
            "status": "successful",
            "transactionId": "TXN_UPI_774821093",
            "upiVpa": "ayesha@oksbi"
        },
        "totals": {
            "subtotal": 14999,
            "discount": 0,
            "tax": 1350,
            "delivery": 0,
            "total": 16349
        },
        "trackingInfo": {
            "carrier": "Delhivery Luxury Service",
            "trackingId": "DEL77293847",
            "estimatedDelivery": "2026-09-19",
            "trackingUrl": "https://www.delhivery.com/track/package/DEL77293847"
        },
        "createdAt": "2026-09-15T10:30:00Z"
    },
    {
        "id": "ord_1006",
        "userId": "usr_001",
        "customerName": "Ayesha Rahman",
        "customerEmail": "ayesha@example.com",
        "items": [
            {
                "productId": "prod_007",
                "productName": "Auric Twisted Vermeil Cuff",
                "productImage": "/images/products/auric-twisted-vermeil-cuff-1.webp",
                "sku": "JWL-CUF-GLD",
                "size": "Standard",
                "color": "18k Gold",
                "quantity": 1,
                "price": 11999
            },
            {
                "productId": "prod_006",
                "productName": "Florentine Chelsea Boot",
                "productImage": "/images/products/florentine-chelsea-boot-1.webp",
                "sku": "BOT-ESP-42",
                "size": "EU 42",
                "color": "Espresso Suede",
                "quantity": 1,
                "price": 21999
            }
        ],
        "status": "Cancelled",
        "statusHistory": [
            {
                "status": "Placed",
                "timestamp": "2026-09-10T16:00:00Z",
                "note": "Order confirmed and registered at Aurelia Central Atelier."
            },
            {
                "status": "Cancelled",
                "timestamp": "2026-09-10T18:30:00Z",
                "note": "Cancelled by customer — size exchange requested."
            }
        ],
        "address": {
            "id": "addr_1",
            "name": "Ayesha Rahman",
            "phone": "+91 98765 43210",
            "line1": "12 MG Road, Alwarpet",
            "city": "Chennai",
            "state": "Tamil Nadu",
            "pincode": "600001",
            "isDefault": true
        },
        "payment": {
            "method": "Card",
            "status": "refunded",
            "transactionId": "TXN_CRD_991827364",
            "cardLast4": "4242"
        },
        "totals": {
            "subtotal": 33998,
            "discount": 0,
            "tax": 3060,
            "delivery": 0,
            "total": 37058
        },
        "trackingInfo": {
            "carrier": "N/A",
            "trackingId": "Cancelled — not dispatched",
            "estimatedDelivery": "N/A"
        },
        "createdAt": "2026-09-10T16:00:00Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/products.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = JSON.parse("[{\"id\":\"prod_001\",\"slug\":\"italian-leather-jacket\",\"name\":\"Italian Leather Jacket\",\"subtitle\":\"Milanese Full-Grain Nappa\",\"description\":\"Hand-finished leather jacket crafted in Milan from supple nappa leather. Features polished palladium hardware, asymmetric front closure, and breathable cupro lining.\",\"details\":[\"100% full-grain calfskin leather\",\"Hand-burnished edges and bespoke palladium zips\",\"Internal chest welt pocket and tailored cuff gussets\",\"Made in Italy by master leather artisans\"],\"materials\":[\"Full-grain Italian calfskin\",\"100% Japanese Bemberg cupro lining\"],\"careGuide\":[\"Specialist leather clean only\",\"Store on wide wooden hanger away from direct sunlight\"],\"categoryId\":\"cat_outerwear\",\"price\":24999,\"compareAtPrice\":32999,\"images\":[\"/images/products/italian-leather-jacket-1.webp\",\"/images/products/italian-leather-jacket-2.webp\"],\"variants\":[{\"sku\":\"LJ-BLK-S\",\"size\":\"S\",\"color\":\"Nocturne Black\",\"stock\":2},{\"sku\":\"LJ-BLK-M\",\"size\":\"M\",\"color\":\"Nocturne Black\",\"stock\":4},{\"sku\":\"LJ-BLK-L\",\"size\":\"L\",\"color\":\"Nocturne Black\",\"stock\":0}],\"availability\":\"low_stock\",\"rating\":{\"average\":4.8,\"count\":32},\"featured\":true,\"isNewArrival\":true,\"isTrending\":true,\"tags\":[\"new-arrival\",\"outerwear\",\"iconic\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_002\",\"slug\":\"sculpted-double-breasted-blazer\",\"name\":\"Sculpted Double-Breasted Blazer\",\"subtitle\":\"Super 140s Virgin Wool\",\"description\":\"An architectural double-breasted silhouette tailored from superfine virgin wool. Sharp peak lapels, horn buttons, and a cinched waistline create commanding presence.\",\"details\":[\"Super 140s pure virgin wool canvas\",\"Hand-stitched pick detailing along lapels\",\"Double back vents with full floating chest canvas\",\"Bespoke horn button fastenings\"],\"materials\":[\"100% Super 140s Wool\",\"Cupro lining\"],\"careGuide\":[\"Dry clean only with eco-solvent\",\"Press with steam cloth\"],\"categoryId\":\"cat_tailoring\",\"price\":18499,\"compareAtPrice\":22999,\"images\":[\"/images/products/sculpted-double-breasted-blazer-1.webp\",\"/images/products/sculpted-double-breasted-blazer-2.webp\",\"/images/products/sculpted-double-breasted-blazer-3.webp\"],\"variants\":[{\"sku\":\"BLZ-NAV-38\",\"size\":\"38R\",\"color\":\"Midnight Navy\",\"stock\":6},{\"sku\":\"BLZ-NAV-40\",\"size\":\"40R\",\"color\":\"Midnight Navy\",\"stock\":5},{\"sku\":\"BLZ-NAV-42\",\"size\":\"42R\",\"color\":\"Midnight Navy\",\"stock\":3}],\"availability\":\"in_stock\",\"rating\":{\"average\":4.9,\"count\":19},\"featured\":true,\"isNewArrival\":false,\"isTrending\":true,\"tags\":[\"tailoring\",\"signature\",\"bestseller\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_003\",\"slug\":\"silk-charmeuse-draped-evening-gown\",\"name\":\"Silk Charmeuse Draped Evening Gown\",\"subtitle\":\"Heavyweight Mulberry Silk\",\"description\":\"Liquid drapery rendered in 30-momme mulberry silk charmeuse. Features an asymmetric bias-cut cowl neckline, delicate low back, and a subtle floor puddle train.\",\"details\":[\"Grade 6A mulberry silk with luminous sheen\",\"Bias cut engineered for effortless drape and movement\",\"Invisible side zip fastening with silk covered loop buttons\",\"Concealed interior bust support band\"],\"materials\":[\"100% Mulberry Silk Charmeuse\"],\"careGuide\":[\"Specialist dry clean only\",\"Steam on lowest delicate setting\"],\"categoryId\":\"cat_eveningwear\",\"price\":38999,\"compareAtPrice\":45000,\"images\":[\"/images/products/silk-charmeuse-draped-evening-gown-1.webp\",\"/images/products/silk-charmeuse-draped-evening-gown-2.webp\",\"/images/products/silk-charmeuse-draped-evening-gown-3.webp\"],\"variants\":[{\"sku\":\"GWN-EMR-XS\",\"size\":\"XS\",\"color\":\"Deep Aubergine\",\"stock\":2},{\"sku\":\"GWN-EMR-S\",\"size\":\"S\",\"color\":\"Deep Aubergine\",\"stock\":3},{\"sku\":\"GWN-EMR-M\",\"size\":\"M\",\"color\":\"Deep Aubergine\",\"stock\":1}],\"availability\":\"low_stock\",\"rating\":{\"average\":5,\"count\":14},\"featured\":true,\"isNewArrival\":true,\"isTrending\":false,\"tags\":[\"new-arrival\",\"eveningwear\",\"editorial\",\"luxury\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_004\",\"slug\":\"mongolian-cashmere-ribbed-turtleneck\",\"name\":\"Mongolian Cashmere Ribbed Turtleneck\",\"subtitle\":\"Grade-A 2-Ply Cashmere\",\"description\":\"Luxuriously soft high-gauge knitwear spun from sustainably gathered Inner Mongolian underfleece. Designed with dropped shoulders and seamless ribbed borders.\",\"details\":[\"Ultra-soft 15.2 micron cashmere fibers\",\"Seamless round-knit body for zero friction\",\"Extended ribbed cuffs and folded collar\",\"Naturally thermo-regulating and anti-pilling\"],\"materials\":[\"100% Grade-A Mongolian Cashmere\"],\"careGuide\":[\"Hand wash in cold water with cashmere shampoo\",\"Dry flat on mesh\"],\"categoryId\":\"cat_knitwear\",\"price\":14999,\"compareAtPrice\":18500,\"images\":[\"/images/products/mongolian-cashmere-ribbed-turtleneck-1.webp\",\"/images/products/mongolian-cashmere-ribbed-turtleneck-2.webp\",\"/images/products/mongolian-cashmere-ribbed-turtleneck-3.webp\"],\"variants\":[{\"sku\":\"CSH-CRM-S\",\"size\":\"S\",\"color\":\"Warm Sand\",\"stock\":5},{\"sku\":\"CSH-CRM-M\",\"size\":\"M\",\"color\":\"Warm Sand\",\"stock\":8},{\"sku\":\"CSH-CRM-L\",\"size\":\"L\",\"color\":\"Warm Sand\",\"stock\":4}],\"availability\":\"in_stock\",\"rating\":{\"average\":4.6,\"count\":34},\"featured\":false,\"isNewArrival\":true,\"isTrending\":true,\"tags\":[\"new-arrival\",\"knitwear\",\"cashmere\",\"winter-essential\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_005\",\"slug\":\"atelier-sculptural-leather-tote\",\"name\":\"Atelier Sculptural Leather Tote\",\"subtitle\":\"Hand-Polished Box Calfskin\",\"description\":\"A geometric leather tote with folded origami gussets and solid brass bridge hardware. Spacious microfiber interior includes a removable zip pouch.\",\"details\":[\"Structured box calf leather that patinas gracefully\",\"Custom magnetic bridge closure with gold vermeil finish\",\"Includes detachable zip clutch with card slots\",\"Reinforced protective metal feet\"],\"materials\":[\"100% Full-grain French box calf\",\"Ultrasuede lining\"],\"careGuide\":[\"Wipe clean with soft microfiber cloth\",\"Condition every 6 months\"],\"categoryId\":\"cat_leather_goods\",\"price\":28999,\"compareAtPrice\":34000,\"images\":[\"/images/products/atelier-sculptural-leather-tote-1.webp\",\"/images/products/atelier-sculptural-leather-tote-2.webp\",\"/images/products/atelier-sculptural-leather-tote-3.webp\"],\"variants\":[{\"sku\":\"TOT-COG-ONE\",\"size\":\"One Size\",\"color\":\"Cognac Ochre\",\"stock\":7},{\"sku\":\"TOT-BLK-ONE\",\"size\":\"One Size\",\"color\":\"Onyx Black\",\"stock\":3}],\"availability\":\"in_stock\",\"rating\":{\"average\":4.9,\"count\":41},\"featured\":true,\"isNewArrival\":false,\"isTrending\":true,\"tags\":[\"accessories\",\"bags\",\"leather-goods\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_006\",\"slug\":\"florentine-chelsea-boot\",\"name\":\"Florentine Chelsea Boot\",\"subtitle\":\"Goodyear-Welted Waxed Suede\",\"description\":\"Handmade in Tuscany using time-tested Goodyear welt construction. Waxed Italian calf suede repels moisture while Vibram rubber half-soles provide refined grip.\",\"details\":[\"Reverse waxed calf suede from Santa Croce sull'Arno\",\"Goodyear welted leather midsole with Vibram rubber tread\",\"Double reinforced elastic side gussets with woven pull tabs\",\"Fully leather lined with arch support footbed\"],\"materials\":[\"Waxed calfskin suede\",\"Vegetable-tanned leather sole\"],\"careGuide\":[\"Suede brush after wear\",\"Apply suede protector spray season-to-season\"],\"categoryId\":\"cat_footwear\",\"price\":21999,\"compareAtPrice\":26500,\"images\":[\"/images/products/florentine-chelsea-boot-1.webp\",\"/images/products/florentine-chelsea-boot-2.webp\",\"/images/products/florentine-chelsea-boot-3.webp\"],\"variants\":[{\"sku\":\"BOT-ESP-41\",\"size\":\"EU 41\",\"color\":\"Espresso Suede\",\"stock\":3},{\"sku\":\"BOT-ESP-42\",\"size\":\"EU 42\",\"color\":\"Espresso Suede\",\"stock\":4},{\"sku\":\"BOT-ESP-43\",\"size\":\"EU 43\",\"color\":\"Espresso Suede\",\"stock\":2},{\"sku\":\"BOT-ESP-44\",\"size\":\"EU 44\",\"color\":\"Espresso Suede\",\"stock\":0}],\"availability\":\"in_stock\",\"rating\":{\"average\":4.4,\"count\":28},\"featured\":false,\"isNewArrival\":true,\"isTrending\":false,\"tags\":[\"new-arrival\",\"footwear\",\"boots\",\"artisan\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_007\",\"slug\":\"auric-twisted-vermeil-cuff\",\"name\":\"Auric Twisted Vermeil Cuff\",\"subtitle\":\"18k Heavy Gold Vermeil\",\"description\":\"Sculptural molten ribbon cuff cast from recycled sterling silver and bathed in a 3-micron thick coat of 18k yellow gold. Subtle hammered interior texture.\",\"details\":[\"Base of recycled 925 sterling silver\",\"3-micron 18k gold vermeil finish (5x thicker than standard plating)\",\"Ergonomic curved form contours cleanly to wrist anatomy\",\"Hallmarked and authenticated in London\"],\"materials\":[\"18k Gold Vermeil over 925 Sterling Silver\"],\"careGuide\":[\"Keep away from perfumes and chlorine\",\"Store in anti-tarnish pouch provided\"],\"categoryId\":\"cat_jewelry\",\"price\":11999,\"compareAtPrice\":14500,\"images\":[\"/images/products/auric-twisted-vermeil-cuff-1.webp\",\"/images/products/auric-twisted-vermeil-cuff-2.webp\",\"/images/products/auric-twisted-vermeil-cuff-3.webp\"],\"variants\":[{\"sku\":\"JWL-CUF-GLD\",\"size\":\"Standard\",\"color\":\"18k Gold\",\"stock\":5}],\"availability\":\"in_stock\",\"rating\":{\"average\":4.9,\"count\":15},\"featured\":true,\"isNewArrival\":false,\"isTrending\":true,\"tags\":[\"jewelry\",\"fine-jewelry\",\"gold\"],\"storefronts\":[\"a\",\"b\"]},{\"id\":\"prod_008\",\"slug\":\"belted-cashmere-wrap-overcoat\",\"name\":\"Belted Cashmere Wrap Overcoat\",\"subtitle\":\"Double-Faced Wool-Cashmere Blend\",\"description\":\"A magnificent winter statement piece with fluid dropped shoulders, oversized storm lapels, and a tie-cinch belt. Completely unlined to highlight double-faced seam craftsmanship.\",\"details\":[\"70% virgin wool, 30% Mongolian cashmere\",\"Hand-split and invisibly stitched perimeter hems\",\"Deep dual patch pockets and detachable wrap belt\",\"Floor-grazing silhouette with high walking vent\"],\"materials\":[\"Virgin Wool & Cashmere Double-Faced Fabric\"],\"careGuide\":[\"Dry clean only\",\"Steam gently to revive loft\"],\"categoryId\":\"cat_outerwear\",\"price\":42999,\"compareAtPrice\":52000,\"images\":[\"/images/products/belted-cashmere-wrap-overcoat-1.webp\",\"/images/products/belted-cashmere-wrap-overcoat-2.webp\",\"/images/products/belted-cashmere-wrap-overcoat-3.webp\"],\"variants\":[{\"sku\":\"OVC-CAM-S\",\"size\":\"S\",\"color\":\"Camel Melange\",\"stock\":2},{\"sku\":\"OVC-CAM-M\",\"size\":\"M\",\"color\":\"Camel Melange\",\"stock\":1},{\"sku\":\"OVC-CAM-L\",\"size\":\"L\",\"color\":\"Camel Melange\",\"stock\":0}],\"availability\":\"low_stock\",\"rating\":{\"average\":5,\"count\":37},\"featured\":true,\"isNewArrival\":true,\"isTrending\":true,\"tags\":[\"new-arrival\",\"outerwear\",\"cashmere\",\"campaign\"],\"storefronts\":[\"a\",\"b\"]}]");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/returns.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "ret_001",
        "orderId": "ord_1001",
        "userId": "usr_001",
        "reason": "Exchanging for different color/fit preference",
        "comments": "The leather jacket is pristine, would like to evaluate standard sizing in store or exchange.",
        "status": "Requested",
        "refundStatus": "pending",
        "createdAt": "2026-09-17T14:00:00Z"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/reviews.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "rev_001",
        "productId": "prod_001",
        "userId": "usr_001",
        "userName": "Ayesha Rahman",
        "rating": 5,
        "title": "Exceptional craftsmanship and drape",
        "body": "Fits impeccably. The nappa leather feels buttery soft, and the palladium hardware has a solid, satisfying weight. Worth every rupee.",
        "date": "2026-08-14T10:00:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_002",
        "productId": "prod_001",
        "userId": "usr_002",
        "userName": "Devika Mehra",
        "rating": 4,
        "title": "Stunning silhouette, true to size",
        "body": "The cut is sharp and editorial. Sleeve length is spot on for size M. Delivery arrived in a museum-grade garment bag.",
        "date": "2026-08-20T14:30:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_003",
        "productId": "prod_002",
        "userId": "usr_003",
        "userName": "Kabir Singhania",
        "rating": 5,
        "title": "Savile Row precision in ready-to-wear",
        "body": "The waist suppression and peak lapel proportion are sublime. Pairs effortlessly with raw denim or pleated trousers.",
        "date": "2026-08-28T09:15:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_004",
        "productId": "prod_003",
        "userId": "usr_001",
        "userName": "Ayesha Rahman",
        "rating": 5,
        "title": "Breathtaking evening silk",
        "body": "Wore this to a private gala in Mumbai and received endless compliments. The fluid drape catches candlelight like liquid velvet.",
        "date": "2026-09-02T16:45:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_005",
        "productId": "prod_005",
        "userId": "usr_002",
        "userName": "Devika Mehra",
        "rating": 5,
        "title": "The pinnacle of minimalist leatherwork",
        "body": "The structured box calf holds its architecture even when fully packed. The brass bridge closure is brilliant.",
        "date": "2026-09-05T11:20:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_006",
        "productId": "prod_008",
        "userId": "usr_003",
        "userName": "Kabir Singhania",
        "rating": 5,
        "title": "A winter heirloom",
        "body": "Double-faced cashmere that feels weightless yet remarkably warm. Seam construction is virtually invisible.",
        "date": "2026-09-08T18:00:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_007",
        "productId": "prod_004",
        "userId": "usr_002",
        "userName": "Devika Mehra",
        "rating": 4,
        "title": "Cloud-like softness, runs slightly small",
        "body": "The cashmere quality is genuinely exceptional — feather-light yet properly insulating. Only caveat: size up one if you prefer a relaxed drape. Otherwise, perfection.",
        "date": "2026-09-10T09:00:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_008",
        "productId": "prod_004",
        "userId": "usr_003",
        "userName": "Nila Krishnamurthy",
        "rating": 3,
        "title": "Beautiful but pilling after 3 wears",
        "body": "The material is undeniably luxurious and the fit is lovely, but I noticed some light pilling under the arms after just three wears. Expected more durability at this price point. Customer care was responsive, though.",
        "date": "2026-09-12T14:20:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_009",
        "productId": "prod_006",
        "userId": "usr_001",
        "userName": "Rohan Verma",
        "rating": 4,
        "title": "Superbly crafted, tight break-in period",
        "body": "The Goodyear welt is impeccable — you can see the quality in every stitch. They do require a solid week of breaking in before they mold comfortably, but once done, the fit is glove-like.",
        "date": "2026-09-13T11:00:00Z",
        "status": "published",
        "verifiedPurchase": true
    },
    {
        "id": "rev_010",
        "productId": "prod_006",
        "userId": "usr_002",
        "userName": "Devika Mehra",
        "rating": 3,
        "title": "Excellent boot, but sizing runs narrow",
        "body": "The craftsmanship is clearly artisanal and the waxed suede has aged beautifully. However, the last runs quite narrow — those with wider feet should size up or look at alternatives. Worth noting before purchase.",
        "date": "2026-09-15T16:45:00Z",
        "status": "published",
        "verifiedPurchase": true
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/storefrontConfig.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "a": {
        "storefront": "a",
        "name": "Editorial Atelier",
        "mode": "Editorial",
        "tagline": "A cinematic high-fashion journal presenting autumnal silhouettes and architectural couture.",
        "sections": [
            {
                "id": "sec_hero",
                "type": "hero",
                "title": "The Autumn Atelier",
                "subtitle": "Vol. IV — Nocturnal Silhouettes",
                "visible": true
            },
            {
                "id": "sec_brand_intro",
                "type": "brand_intro",
                "title": "The House Philosophy",
                "subtitle": "Quiet Grandeur & Sculptural Precision",
                "visible": true
            },
            {
                "id": "sec_category_showcase",
                "type": "category_showcase",
                "title": "Curated Dimensions",
                "subtitle": "Explore by Discipline",
                "visible": true
            },
            {
                "id": "sec_expanding_carousel",
                "type": "expanding_carousel",
                "title": "Signature Icons",
                "subtitle": "Touch to Expand & Reveal",
                "visible": true
            },
            {
                "id": "sec_new_arrivals",
                "type": "new_arrivals",
                "title": "Fresh from the Milan Atelier",
                "subtitle": "Limited First Editions",
                "visible": true
            },
            {
                "id": "sec_editorial_campaign",
                "type": "editorial_campaign",
                "title": "Midnight in Florence",
                "subtitle": "A Visual Study in Hand-Finished Nappa and Liquid Silk",
                "visible": true
            },
            {
                "id": "sec_trending",
                "type": "trending_products",
                "title": "House Favorites",
                "subtitle": "Coveted Pieces of the Season",
                "visible": true
            },
            {
                "id": "sec_story",
                "type": "brand_story",
                "title": "Craftsmanship Without Compromise",
                "subtitle": "100% Traceable European Materials",
                "visible": true
            },
            {
                "id": "sec_newsletter",
                "type": "newsletter",
                "title": "The Private Ledger",
                "subtitle": "Receive invitations to private salon previews and new editions.",
                "visible": false
            }
        ]
    },
    "b": {
        "storefront": "b",
        "name": "Refined Boutique",
        "mode": "Refined",
        "tagline": "A minimalist, product-first salon focused on wardrobe foundations and direct discovery.",
        "sections": [
            {
                "id": "sec_hero",
                "type": "hero",
                "title": "The Permanent Wardrobe",
                "subtitle": "Modern Essentials & Hand-Finished Pieces",
                "visible": true
            },
            {
                "id": "sec_category_showcase",
                "type": "category_showcase",
                "title": "Shop by Category",
                "subtitle": "Tailoring, Cashmere & Leather Goods",
                "visible": true
            },
            {
                "id": "sec_new_arrivals",
                "type": "new_arrivals",
                "title": "New Additions",
                "subtitle": "Autumn / Winter Wardrobe",
                "visible": true
            },
            {
                "id": "sec_trending",
                "type": "trending_products",
                "title": "Most Considered",
                "subtitle": "Essential House Silhouettes",
                "visible": true
            },
            {
                "id": "sec_expanding_carousel",
                "type": "expanding_carousel",
                "title": "Curated Highlights",
                "subtitle": "Explore Selected Pieces",
                "visible": true
            },
            {
                "id": "sec_story",
                "type": "brand_story",
                "title": "Artisanal Integrity",
                "subtitle": "Every garment tailored with longevity in mind.",
                "visible": true
            },
            {
                "id": "sec_newsletter",
                "type": "newsletter",
                "title": "Atelier Correspondence",
                "subtitle": "Subscribed clients receive private styling consultations.",
                "visible": false
            }
        ]
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/supportTickets.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "tkt_001",
        "userId": "usr_001",
        "userName": "Ayesha Rahman",
        "userEmail": "ayesha@example.com",
        "subject": "Size consultation for evening gown",
        "message": "I am 5'8\" and usually wear EU 36. Should I order size S or XS in the Silk Charmeuse Gown?",
        "status": "In Progress",
        "createdAt": "2026-09-15T10:30:00Z",
        "responses": [
            {
                "id": "resp_001",
                "authorName": "Aurelia Client Concierge",
                "isAdmin": true,
                "message": "Dear Ayesha, the Silk Charmeuse Gown is cut on the bias and offers a fluid, forgiving drape. For 5'8\" and EU 36, size S will ensure the exact puddle train length shown in our campaign imagery without pulling across the hip.",
                "createdAt": "2026-09-15T12:00:00Z"
            }
        ]
    },
    {
        "id": "tkt_002",
        "userId": "usr_002",
        "userName": "Devika Mehra",
        "userEmail": "devika@example.com",
        "subject": "White glove delivery window",
        "message": "Can I arrange for evening delivery between 6 PM - 8 PM in Mumbai for my order?",
        "status": "Resolved",
        "createdAt": "2026-09-16T08:15:00Z",
        "responses": [
            {
                "id": "resp_002",
                "authorName": "Aurelia Logistics Desk",
                "isAdmin": true,
                "message": "Good morning Devika. Your courier dispatch has been coordinated with our luxury courier partner for an evening appointment between 6:00 PM and 8:00 PM at your Bandra residence.",
                "createdAt": "2026-09-16T09:40:00Z"
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/users.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "id": "usr_001",
        "name": "Ayesha Rahman",
        "email": "ayesha@example.com",
        "role": "customer",
        "phone": "+91 98765 43210",
        "addresses": [
            {
                "id": "addr_1",
                "name": "Ayesha Rahman",
                "phone": "+91 98765 43210",
                "line1": "12 MG Road, Alwarpet",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "pincode": "600001",
                "isDefault": true
            },
            {
                "id": "addr_1_alt",
                "name": "Ayesha Rahman (Atelier)",
                "phone": "+91 98765 43210",
                "line1": "44 Boat Club Road",
                "city": "Chennai",
                "state": "Tamil Nadu",
                "pincode": "600028",
                "isDefault": false
            }
        ],
        "notificationPreferences": {
            "emailPromotions": true,
            "emailOrderUpdates": true,
            "emailNewsletter": true,
            "emailSecurityAlerts": true
        }
    },
    {
        "id": "usr_002",
        "name": "Devika Mehra",
        "email": "devika@example.com",
        "role": "customer",
        "phone": "+91 98111 22334",
        "addresses": [
            {
                "id": "addr_2",
                "name": "Devika Mehra",
                "phone": "+91 98111 22334",
                "line1": "Flat 4B, Regency Heights, Bandra West",
                "city": "Mumbai",
                "state": "Maharashtra",
                "pincode": "400050",
                "isDefault": true
            }
        ],
        "notificationPreferences": {
            "emailPromotions": false,
            "emailOrderUpdates": true,
            "emailNewsletter": true,
            "emailSecurityAlerts": true
        }
    },
    {
        "id": "usr_003",
        "name": "Kabir Singhania",
        "email": "kabir@example.com",
        "role": "customer",
        "phone": "+91 98222 55443",
        "addresses": [
            {
                "id": "addr_3",
                "name": "Kabir Singhania",
                "phone": "+91 98222 55443",
                "line1": "Villa 18, Golf Links",
                "city": "New Delhi",
                "state": "Delhi",
                "pincode": "110003",
                "isDefault": true
            }
        ],
        "notificationPreferences": {
            "emailPromotions": true,
            "emailOrderUpdates": true,
            "emailNewsletter": false,
            "emailSecurityAlerts": true
        }
    },
    {
        "id": "usr_admin",
        "name": "Marcus Vance",
        "email": "admin@aurelia-atelier.com",
        "role": "admin",
        "phone": "+91 98000 11223",
        "addresses": [
            {
                "id": "addr_adm",
                "name": "Aurelia HQ Operations",
                "phone": "+91 98000 11223",
                "line1": "Penthouse 9, UB City",
                "city": "Bengaluru",
                "state": "Karnataka",
                "pincode": "560001",
                "isDefault": true
            }
        ],
        "notificationPreferences": {
            "emailPromotions": false,
            "emailOrderUpdates": true,
            "emailNewsletter": false,
            "emailSecurityAlerts": true
        }
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/wishlists.json.[json].cjs [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = [
    {
        "userId": "usr_001",
        "productIds": [
            "prod_001",
            "prod_004",
            "prod_008"
        ]
    },
    {
        "userId": "usr_002",
        "productIds": [
            "prod_002",
            "prod_005"
        ]
    },
    {
        "userId": "usr_003",
        "productIds": [
            "prod_003",
            "prod_007"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_CANCELLABLE_STATUSES",
    ()=>ADMIN_CANCELLABLE_STATUSES,
    "BRAND_NAME",
    ()=>BRAND_NAME,
    "BRAND_TAGLINE",
    ()=>BRAND_TAGLINE,
    "CUSTOMER_CANCELLABLE_STATUSES",
    ()=>CUSTOMER_CANCELLABLE_STATUSES,
    "LOW_STOCK_THRESHOLD",
    ()=>LOW_STOCK_THRESHOLD,
    "MOCK_API_DELAY_MS",
    ()=>MOCK_API_DELAY_MS,
    "RETURN_WINDOW_DAYS",
    ()=>RETURN_WINDOW_DAYS,
    "SUPPORTED_NOTIFICATION_CHANNELS",
    ()=>SUPPORTED_NOTIFICATION_CHANNELS
]);
const BRAND_NAME = 'AURELIA';
const BRAND_TAGLINE = 'Haute Couture & Ready-to-Wear Atelier';
const RETURN_WINDOW_DAYS = 7;
const CUSTOMER_CANCELLABLE_STATUSES = [
    'Placed',
    'Confirmed'
];
const ADMIN_CANCELLABLE_STATUSES = [
    'Placed',
    'Confirmed',
    'Packed'
];
const LOW_STOCK_THRESHOLD = 3;
const SUPPORTED_NOTIFICATION_CHANNELS = [
    'email'
];
const MOCK_API_DELAY_MS = 200;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/formatPrice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Single source of truth for price formatting across the entire application.
 * Formats values in INR (₹) with Indian numbering grouping (lakhs/crores).
 */ __turbopack_context__.s([
    "formatPrice",
    ()=>formatPrice
]);
function formatPrice(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mockApi.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addReview",
    ()=>addReview,
    "addTicketResponse",
    ()=>addTicketResponse,
    "adminExportReport",
    ()=>adminExportReport,
    "adminGetDashboardStats",
    ()=>adminGetDashboardStats,
    "adminProcessReturn",
    ()=>adminProcessReturn,
    "adminUpdateOrderStatus",
    ()=>adminUpdateOrderStatus,
    "adminUpdateProductStock",
    ()=>adminUpdateProductStock,
    "applyCoupon",
    ()=>applyCoupon,
    "cancelOrder",
    ()=>cancelOrder,
    "createSupportTicket",
    ()=>createSupportTicket,
    "getBanners",
    ()=>getBanners,
    "getCategories",
    ()=>getCategories,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getCoupons",
    ()=>getCoupons,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getFeaturedProducts",
    ()=>getFeaturedProducts,
    "getNewArrivals",
    ()=>getNewArrivals,
    "getOrderById",
    ()=>getOrderById,
    "getOrders",
    ()=>getOrders,
    "getProductById",
    ()=>getProductById,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProducts",
    ()=>getProducts,
    "getReturnById",
    ()=>getReturnById,
    "getReturns",
    ()=>getReturns,
    "getReviews",
    ()=>getReviews,
    "getStorefrontConfig",
    ()=>getStorefrontConfig,
    "getSupportTickets",
    ()=>getSupportTickets,
    "getTrendingProducts",
    ()=>getTrendingProducts,
    "getUsers",
    ()=>getUsers,
    "getWishlist",
    ()=>getWishlist,
    "loginUser",
    ()=>loginUser,
    "placeOrder",
    ()=>placeOrder,
    "requestReturn",
    ()=>requestReturn,
    "toggleWishlist",
    ()=>toggleWishlist,
    "triggerCsvDownload",
    ()=>triggerCsvDownload,
    "validateStock",
    ()=>validateStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/categories.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$reviews$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/reviews.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$orders$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/orders.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/users.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$coupons$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/coupons.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$wishlists$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/wishlists.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$banners$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/banners.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$supportTickets$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/supportTickets.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$returns$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/returns.json.[json].cjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storefrontConfig$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/storefrontConfig.json.[json].cjs [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
// Simulated network latency helper
const delay = (ms = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_API_DELAY_MS"])=>new Promise((resolve)=>setTimeout(resolve, ms));
// Helper for client-side localStorage persistence across refreshes
function getInitialData(key, fallback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const item = window.localStorage.getItem(`aurelia_${key}`);
        return item ? JSON.parse(item) : fallback;
    } catch  {
        return fallback;
    }
}
function saveData(key, data) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem(`aurelia_${key}`, JSON.stringify(data));
    } catch  {
    // Ignore storage quota issues in mock
    }
}
// In-memory / localStorage state holders
let productsState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let reviewsState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$reviews$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let ordersState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$orders$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let couponsState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$coupons$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let bannersState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$banners$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let supportTicketsState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$supportTickets$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let returnsState = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$returns$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
];
let wishlistsState = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$wishlists$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].reduce((acc, curr)=>({
        ...acc,
        [curr.userId]: curr.productIds
    }), {});
// Initialize client-side state on first mount
function ensureClientState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    productsState = getInitialData('products', productsState);
    reviewsState = getInitialData('reviews', reviewsState);
    ordersState = getInitialData('orders', ordersState);
    couponsState = getInitialData('coupons', couponsState);
    bannersState = getInitialData('banners', bannersState);
    supportTicketsState = getInitialData('supportTickets', supportTicketsState);
    returnsState = getInitialData('returns', returnsState);
    wishlistsState = getInitialData('wishlists', wishlistsState);
}
async function getProducts(filters) {
    await delay();
    ensureClientState();
    let list = [
        ...productsState
    ];
    if (filters?.storefront) {
        list = list.filter((p)=>p.storefronts.includes(filters.storefront));
    }
    if (filters?.categorySlug) {
        const category = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((c)=>c.slug === filters.categorySlug);
        if (category) {
            list = list.filter((p)=>p.categoryId === category.id);
        }
    }
    if (filters?.minPrice !== undefined) {
        list = list.filter((p)=>p.price >= filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
        list = list.filter((p)=>p.price <= filters.maxPrice);
    }
    if (filters?.rating !== undefined) {
        list = list.filter((p)=>p.rating.average >= filters.rating);
    }
    if (filters?.availability) {
        list = list.filter((p)=>p.availability === filters.availability);
    }
    if (filters?.tag) {
        list = list.filter((p)=>p.tags.includes(filters.tag));
    }
    if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        list = list.filter((p)=>p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t)=>t.toLowerCase().includes(q)));
    }
    if (filters?.sortBy) {
        switch(filters.sortBy){
            case 'price-asc':
                list.sort((a, b)=>a.price - b.price);
                break;
            case 'price-desc':
                list.sort((a, b)=>b.price - a.price);
                break;
            case 'rating':
                list.sort((a, b)=>b.rating.average - a.rating.average);
                break;
            case 'newest':
                list.sort((a, b)=>(b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
                break;
            case 'popularity':
            default:
                list.sort((a, b)=>b.rating.count - a.rating.count);
                break;
        }
    }
    return list;
}
async function getProductBySlug(slug) {
    await delay();
    ensureClientState();
    const product = productsState.find((p)=>p.slug === slug);
    return product || null;
}
async function getProductById(id) {
    await delay();
    ensureClientState();
    const product = productsState.find((p)=>p.id === id);
    return product || null;
}
async function getFeaturedProducts(storefront) {
    await delay();
    ensureClientState();
    let list = productsState.filter((p)=>p.featured);
    if (storefront) {
        list = list.filter((p)=>p.storefronts.includes(storefront));
    }
    return list;
}
async function getNewArrivals(storefront) {
    await delay();
    ensureClientState();
    let list = productsState.filter((p)=>p.isNewArrival);
    if (storefront) {
        list = list.filter((p)=>p.storefronts.includes(storefront));
    }
    return list;
}
async function getTrendingProducts(storefront) {
    await delay();
    ensureClientState();
    let list = productsState.filter((p)=>p.isTrending);
    if (storefront) {
        list = list.filter((p)=>p.storefronts.includes(storefront));
    }
    return list;
}
async function getCategories() {
    await delay();
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].filter((c)=>c.visible);
}
async function getCategoryBySlug(slug) {
    await delay();
    const cat = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$categories$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((c)=>c.slug === slug);
    return cat || null;
}
async function getReviews(productId) {
    await delay();
    ensureClientState();
    return reviewsState.filter((r)=>r.productId === productId && r.status === 'published');
}
async function addReview(reviewData) {
    await delay();
    ensureClientState();
    const newReview = {
        ...reviewData,
        id: `rev_${Date.now()}`,
        date: new Date().toISOString(),
        status: 'published'
    };
    reviewsState = [
        newReview,
        ...reviewsState
    ];
    saveData('reviews', reviewsState);
    return newReview;
}
async function getBanners(storefront) {
    await delay();
    ensureClientState();
    return bannersState.filter((b)=>b.active && (b.storefront === storefront || b.storefront === 'both')).sort((a, b)=>a.sortOrder - b.sortOrder);
}
async function getStorefrontConfig(storefront) {
    await delay();
    const configs = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$storefrontConfig$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
    return configs[storefront] || configs['a'];
}
async function getOrders(userId) {
    await delay();
    ensureClientState();
    if (userId) {
        return ordersState.filter((o)=>o.userId === userId);
    }
    return ordersState;
}
async function getOrderById(orderId) {
    await delay();
    ensureClientState();
    const order = ordersState.find((o)=>o.id === orderId);
    return order || null;
}
async function cancelOrder(orderId, actor) {
    await delay();
    ensureClientState();
    const index = ordersState.findIndex((o)=>o.id === orderId);
    if (index === -1) {
        return {
            success: false,
            error: 'Order not found.'
        };
    }
    const order = ordersState[index];
    if (actor === 'customer') {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CUSTOMER_CANCELLABLE_STATUSES"].includes(order.status)) {
            return {
                success: false,
                error: `Cancellation is no longer available for status "${order.status}". Orders already packed or dispatched require client concierge assistance.`
            };
        }
    } else if (actor === 'admin') {
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ADMIN_CANCELLABLE_STATUSES"].includes(order.status)) {
            return {
                success: false,
                error: `Admin cancellation permitted only prior to shipment. Current status is "${order.status}".`
            };
        }
    }
    const updatedOrder = {
        ...order,
        status: 'Cancelled',
        statusHistory: [
            ...order.statusHistory,
            {
                status: 'Cancelled',
                timestamp: new Date().toISOString(),
                note: `Cancelled by ${actor}`
            }
        ]
    };
    ordersState[index] = updatedOrder;
    saveData('orders', ordersState);
    return {
        success: true,
        order: updatedOrder
    };
}
async function requestReturn(orderId, reason, comments) {
    await delay();
    ensureClientState();
    const order = ordersState.find((o)=>o.id === orderId);
    if (!order) {
        return {
            success: false,
            error: 'Order not found.'
        };
    }
    if (order.status !== 'Delivered') {
        return {
            success: false,
            error: 'Return requests can only be initiated once an order has been Delivered.'
        };
    }
    // Check delivery timestamp against RETURN_WINDOW_DAYS
    const deliveredEntry = order.statusHistory.find((h)=>h.status === 'Delivered');
    if (deliveredEntry) {
        const deliveryDate = new Date(deliveredEntry.timestamp).getTime();
        const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
        if (daysSinceDelivery > __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RETURN_WINDOW_DAYS"]) {
            return {
                success: false,
                error: `The ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RETURN_WINDOW_DAYS"]}-day return privilege window for this order has expired.`
            };
        }
    }
    const newReturn = {
        id: `ret_${Date.now()}`,
        orderId: order.id,
        userId: order.userId,
        reason,
        comments,
        status: 'Requested',
        refundStatus: 'pending',
        createdAt: new Date().toISOString()
    };
    returnsState = [
        newReturn,
        ...returnsState
    ];
    saveData('returns', returnsState);
    return {
        success: true,
        returnRequest: newReturn
    };
}
async function getReturns(userId) {
    await delay();
    ensureClientState();
    if (userId) {
        return returnsState.filter((r)=>r.userId === userId);
    }
    return returnsState;
}
async function getReturnById(returnId) {
    await delay();
    ensureClientState();
    const req = returnsState.find((r)=>r.id === returnId);
    return req || null;
}
async function validateStock(items) {
    await delay(150);
    ensureClientState();
    const outOfStockSkus = [];
    for (const item of items){
        let found = false;
        for (const p of productsState){
            const variant = p.variants.find((v)=>v.sku === item.sku);
            if (variant) {
                found = true;
                if (variant.stock < item.quantity) {
                    outOfStockSkus.push(item.sku);
                }
                break;
            }
        }
        if (!found) {
            outOfStockSkus.push(item.sku);
        }
    }
    if (outOfStockSkus.length > 0) {
        return {
            valid: false,
            outOfStockSkus,
            message: `Some items in your bag (${outOfStockSkus.join(', ')}) are no longer available in the requested quantity. Please update your bag.`
        };
    }
    return {
        valid: true,
        outOfStockSkus: []
    };
}
async function placeOrder(orderData) {
    await delay(300);
    ensureClientState();
    // 1. Stock revalidation check
    const stockCheck = await validateStock(orderData.items.map((i)=>({
            sku: i.sku,
            quantity: i.quantity
        })));
    if (!stockCheck.valid) {
        return {
            success: false,
            error: stockCheck.message
        };
    }
    // 2. Decrement stock
    for (const item of orderData.items){
        for (const product of productsState){
            const variant = product.variants.find((v)=>v.sku === item.sku);
            if (variant) {
                variant.stock = Math.max(0, variant.stock - item.quantity);
                // update overall availability
                const totalStock = product.variants.reduce((acc, v)=>acc + v.stock, 0);
                if (totalStock === 0) {
                    product.availability = 'out_of_stock';
                } else if (totalStock <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOW_STOCK_THRESHOLD"]) {
                    product.availability = 'low_stock';
                }
            }
        }
    }
    saveData('products', productsState);
    // 3. Create order
    const newOrder = {
        ...orderData,
        id: `ord_${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'Placed',
        statusHistory: [
            {
                status: 'Placed',
                timestamp: new Date().toISOString(),
                note: 'Order confirmed and registered at Aurelia Central Atelier.'
            }
        ]
    };
    ordersState = [
        newOrder,
        ...ordersState
    ];
    saveData('orders', ordersState);
    return {
        success: true,
        order: newOrder
    };
}
async function applyCoupon(code, subtotal) {
    await delay(200);
    ensureClientState();
    const coupon = couponsState.find((c)=>c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
        return {
            valid: false,
            discountAmount: 0,
            message: 'Invalid promotional code.'
        };
    }
    if (!coupon.active) {
        return {
            valid: false,
            discountAmount: 0,
            message: 'This privilege code has expired.'
        };
    }
    if (new Date(coupon.expiryDate).getTime() < Date.now()) {
        return {
            valid: false,
            discountAmount: 0,
            message: 'This privilege code has reached its validity date.'
        };
    }
    if (subtotal < coupon.minOrderValue) {
        return {
            valid: false,
            discountAmount: 0,
            message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for code ${coupon.code}.`
        };
    }
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
        discountAmount = Math.round(subtotal * coupon.value / 100);
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
        }
    } else {
        discountAmount = coupon.value;
    }
    return {
        valid: true,
        discountAmount,
        coupon,
        message: `Privilege code ${coupon.code} applied successfully!`
    };
}
async function getCoupons() {
    await delay();
    ensureClientState();
    return couponsState.filter((c)=>c.active);
}
async function getUsers() {
    await delay();
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
}
async function getCurrentUser(userId = 'usr_001') {
    await delay();
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((u)=>u.id === userId);
    return user || null;
}
async function loginUser(email) {
    await delay(350);
    const found = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((u)=>u.email.toLowerCase() === email.toLowerCase());
    if (found) {
        return found;
    }
    // Auto register mock client if not found
    return {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].toUpperCase(),
        email,
        role: 'customer',
        addresses: [],
        notificationPreferences: {
            emailPromotions: true,
            emailOrderUpdates: true,
            emailNewsletter: true,
            emailSecurityAlerts: true
        }
    };
}
async function getWishlist(userId = 'usr_001') {
    await delay(100);
    ensureClientState();
    return wishlistsState[userId] || [];
}
async function toggleWishlist(userId = 'usr_001', productId) {
    await delay(150);
    ensureClientState();
    const current = wishlistsState[userId] || [];
    const updated = current.includes(productId) ? current.filter((id)=>id !== productId) : [
        ...current,
        productId
    ];
    wishlistsState = {
        ...wishlistsState,
        [userId]: updated
    };
    saveData('wishlists', wishlistsState);
    return updated;
}
async function getSupportTickets(userId) {
    await delay();
    ensureClientState();
    if (userId) {
        return supportTicketsState.filter((t)=>t.userId === userId);
    }
    return supportTicketsState;
}
async function createSupportTicket(data) {
    await delay(250);
    ensureClientState();
    const newTicket = {
        ...data,
        id: `tkt_${Date.now().toString().slice(-5)}`,
        status: 'Open',
        createdAt: new Date().toISOString(),
        responses: []
    };
    supportTicketsState = [
        newTicket,
        ...supportTicketsState
    ];
    saveData('supportTickets', supportTicketsState);
    return newTicket;
}
async function addTicketResponse(ticketId, message, isAdmin, authorName) {
    await delay(200);
    ensureClientState();
    const ticketIndex = supportTicketsState.findIndex((t)=>t.id === ticketId);
    if (ticketIndex === -1) {
        throw new Error('Ticket not found');
    }
    const responseItem = {
        id: `resp_${Date.now()}`,
        authorName,
        isAdmin,
        message,
        createdAt: new Date().toISOString()
    };
    const updatedTicket = {
        ...supportTicketsState[ticketIndex],
        status: isAdmin ? 'In Progress' : supportTicketsState[ticketIndex].status,
        responses: [
            ...supportTicketsState[ticketIndex].responses,
            responseItem
        ]
    };
    supportTicketsState[ticketIndex] = updatedTicket;
    saveData('supportTickets', supportTicketsState);
    return updatedTicket;
}
async function adminGetDashboardStats() {
    await delay();
    ensureClientState();
    const grossRevenue = ordersState.filter((o)=>o.status !== 'Cancelled').reduce((acc, o)=>acc + o.totals.total, 0);
    const lowStockItemsCount = productsState.filter((p)=>p.availability === 'low_stock' || p.availability === 'out_of_stock').length;
    const pendingReturnsCount = returnsState.filter((r)=>r.status === 'Requested').length;
    const openTicketsCount = supportTicketsState.filter((t)=>t.status === 'Open' || t.status === 'In Progress').length;
    return {
        grossRevenue,
        totalOrders: ordersState.length,
        activeCustomers: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].filter((u)=>u.role === 'customer').length,
        averageOrderValue: ordersState.length > 0 ? Math.round(grossRevenue / ordersState.length) : 0,
        lowStockItemsCount,
        pendingReturnsCount,
        openTicketsCount
    };
}
async function adminUpdateOrderStatus(orderId, status, trackingInfo) {
    await delay(250);
    ensureClientState();
    const index = ordersState.findIndex((o)=>o.id === orderId);
    if (index === -1) throw new Error('Order not found');
    const order = ordersState[index];
    const updatedOrder = {
        ...order,
        status,
        trackingInfo: trackingInfo || order.trackingInfo,
        statusHistory: [
            ...order.statusHistory,
            {
                status,
                timestamp: new Date().toISOString(),
                note: `Updated by Atelier Operations (${status})`
            }
        ]
    };
    ordersState[index] = updatedOrder;
    saveData('orders', ordersState);
    return updatedOrder;
}
async function adminUpdateProductStock(sku, newStock) {
    await delay(200);
    ensureClientState();
    let found = false;
    for (const p of productsState){
        const variant = p.variants.find((v)=>v.sku === sku);
        if (variant) {
            variant.stock = Math.max(0, newStock);
            found = true;
            const totalStock = p.variants.reduce((acc, v)=>acc + v.stock, 0);
            if (totalStock === 0) {
                p.availability = 'out_of_stock';
            } else if (totalStock <= __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOW_STOCK_THRESHOLD"]) {
                p.availability = 'low_stock';
            } else {
                p.availability = 'in_stock';
            }
            break;
        }
    }
    if (found) {
        saveData('products', productsState);
    }
    return found;
}
async function adminProcessReturn(returnId, status, refundStatus) {
    await delay(250);
    ensureClientState();
    const index = returnsState.findIndex((r)=>r.id === returnId);
    if (index === -1) throw new Error('Return request not found');
    const updated = {
        ...returnsState[index],
        status,
        refundStatus,
        resolvedAt: new Date().toISOString()
    };
    returnsState[index] = updated;
    saveData('returns', returnsState);
    return updated;
}
async function adminExportReport(reportType, filters) {
    await delay(300);
    ensureClientState();
    let csvContent = '';
    if (reportType === 'orders' || reportType === 'sales') {
        let list = [
            ...ordersState
        ];
        if (filters?.status) {
            list = list.filter((o)=>o.status === filters.status);
        }
        const headers = [
            'Order ID',
            'Customer Name',
            'Customer Email',
            'Status',
            'Date',
            'Subtotal (INR)',
            'Discount',
            'Tax',
            'Total (INR)',
            'Payment Method',
            'Carrier',
            'Tracking ID'
        ];
        const rows = list.map((o)=>[
                o.id,
                `"${o.customerName || ''}"`,
                o.customerEmail || '',
                o.status,
                o.createdAt,
                o.totals.subtotal,
                o.totals.discount,
                o.totals.tax,
                o.totals.total,
                o.payment.method,
                o.trackingInfo?.carrier || '',
                o.trackingInfo?.trackingId || ''
            ]);
        csvContent = [
            headers.join(','),
            ...rows.map((r)=>r.join(','))
        ].join('\n');
    } else if (reportType === 'inventory') {
        const headers = [
            'Product ID',
            'Product Name',
            'SKU',
            'Size',
            'Color',
            'Stock',
            'Availability',
            'Price (INR)'
        ];
        const rows = [];
        for (const p of productsState){
            for (const v of p.variants){
                rows.push([
                    p.id,
                    `"${p.name}"`,
                    v.sku,
                    v.size,
                    v.color,
                    v.stock.toString(),
                    p.availability,
                    p.price.toString()
                ]);
            }
        }
        csvContent = [
            headers.join(','),
            ...rows.map((r)=>r.join(','))
        ].join('\n');
    } else if (reportType === 'customers') {
        const headers = [
            'User ID',
            'Name',
            'Email',
            'Role',
            'Phone',
            'Orders Count'
        ];
        const users = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
        const rows = users.map((u)=>{
            const userOrders = ordersState.filter((o)=>o.userId === u.id);
            return [
                u.id,
                `"${u.name}"`,
                u.email,
                u.role,
                u.phone || '',
                userOrders.length.toString()
            ];
        });
        csvContent = [
            headers.join(','),
            ...rows.map((r)=>r.join(','))
        ].join('\n');
    }
    return csvContent;
}
function triggerCsvDownload(csvString, filename) {
    const blob = new Blob([
        csvString
    ], {
        type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useAuthStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/users.json.[json].cjs [app-client] (ecmascript)");
'use client';
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>{
    const defaultCustomer = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((u)=>u.id === 'usr_001') || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][0];
    const defaultAdmin = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].find((u)=>u.role === 'admin') || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$users$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"][3];
    return {
        user: defaultCustomer,
        role: 'customer',
        isAuthenticated: true,
        setUser: (user)=>{
            set({
                user,
                role: user ? user.role : 'customer',
                isAuthenticated: !!user
            });
        },
        setRole: (role)=>{
            set((state)=>({
                    role,
                    user: role === 'admin' ? defaultAdmin : state.user?.role === 'customer' ? state.user : defaultCustomer
                }));
        },
        loginAsCustomer: ()=>{
            set({
                user: defaultCustomer,
                role: 'customer',
                isAuthenticated: true
            });
        },
        loginAsAdmin: ()=>{
            set({
                user: defaultAdmin,
                role: 'admin',
                isAuthenticated: true
            });
        },
        logout: ()=>{
            set({
                user: null,
                role: 'customer',
                isAuthenticated: false
            });
        }
    };
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useCartStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCartStore",
    ()=>useCartStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockApi.ts [app-client] (ecmascript)");
'use client';
;
;
const useCartStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        items: [
            // Pre-populate with one luxury piece for instant demo delight
            {
                product: {
                    id: 'prod_001',
                    slug: 'italian-leather-jacket',
                    name: 'Italian Leather Jacket',
                    subtitle: 'Milanese Full-Grain Nappa',
                    description: 'Hand-finished leather jacket crafted in Milan from supple nappa leather.',
                    categoryId: 'cat_outerwear',
                    price: 24999,
                    images: [
                        '/images/products/italian-leather-jacket-1.webp'
                    ],
                    variants: [
                        {
                            sku: 'LJ-BLK-M',
                            size: 'M',
                            color: 'Nocturne Black',
                            stock: 4
                        }
                    ],
                    availability: 'low_stock',
                    rating: {
                        average: 4.8,
                        count: 32
                    },
                    featured: true,
                    tags: [
                        'new-arrival',
                        'outerwear'
                    ],
                    storefronts: [
                        'a',
                        'b'
                    ]
                },
                sku: 'LJ-BLK-M',
                size: 'M',
                color: 'Nocturne Black',
                quantity: 1,
                price: 24999
            }
        ],
        isDrawerOpen: false,
        appliedCoupon: null,
        discountAmount: 0,
        couponError: null,
        checkoutMode: 'cart',
        buyNowItem: null,
        setBuyNowItem: (product, sku, size, color, quantity)=>{
            set({
                buyNowItem: {
                    product,
                    sku,
                    size,
                    color,
                    quantity,
                    price: product.price
                },
                checkoutMode: 'buy_now'
            });
        },
        clearBuyNowItem: ()=>{
            set({
                buyNowItem: null,
                checkoutMode: 'cart'
            });
        },
        setCheckoutMode: (mode)=>set({
                checkoutMode: mode
            }),
        addItem: (product, sku, size, color, quantity = 1, openDrawer = true)=>{
            set((state)=>{
                const existingIndex = state.items.findIndex((item)=>item.sku === sku);
                if (existingIndex > -1) {
                    const newItems = [
                        ...state.items
                    ];
                    newItems[existingIndex].quantity += quantity;
                    return {
                        items: newItems,
                        isDrawerOpen: openDrawer ? true : state.isDrawerOpen,
                        checkoutMode: 'cart',
                        buyNowItem: null
                    };
                }
                return {
                    items: [
                        ...state.items,
                        {
                            product,
                            sku,
                            size,
                            color,
                            quantity,
                            price: product.price
                        }
                    ],
                    isDrawerOpen: openDrawer ? true : state.isDrawerOpen,
                    checkoutMode: 'cart',
                    buyNowItem: null
                };
            });
        },
        removeItem: (sku)=>{
            set((state)=>({
                    items: state.items.filter((item)=>item.sku !== sku)
                }));
        },
        updateQuantity: (sku, quantity)=>{
            if (quantity <= 0) {
                get().removeItem(sku);
                return;
            }
            set((state)=>({
                    items: state.items.map((item)=>item.sku === sku ? {
                            ...item,
                            quantity
                        } : item)
                }));
        },
        clearCart: ()=>{
            set({
                items: [],
                appliedCoupon: null,
                discountAmount: 0,
                couponError: null,
                checkoutMode: 'cart',
                buyNowItem: null
            });
        },
        openDrawer: ()=>set({
                isDrawerOpen: true,
                checkoutMode: 'cart',
                buyNowItem: null
            }),
        closeDrawer: ()=>set({
                isDrawerOpen: false
            }),
        toggleDrawer: ()=>set((state)=>({
                    isDrawerOpen: !state.isDrawerOpen,
                    checkoutMode: 'cart',
                    buyNowItem: null
                })),
        applyCouponCode: async (code)=>{
            const subtotal = get().getSubtotal();
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyCoupon"])(code, subtotal);
            if (res.valid && res.coupon) {
                set({
                    appliedCoupon: res.coupon,
                    discountAmount: res.discountAmount,
                    couponError: null
                });
                return true;
            } else {
                set({
                    couponError: res.message || 'Invalid coupon'
                });
                return false;
            }
        },
        removeCoupon: ()=>set({
                appliedCoupon: null,
                discountAmount: 0,
                couponError: null
            }),
        getActiveItems: ()=>{
            const state = get();
            return state.checkoutMode === 'buy_now' && state.buyNowItem ? [
                state.buyNowItem
            ] : state.items;
        },
        getSubtotal: ()=>{
            const state = get();
            const activeItems = state.checkoutMode === 'buy_now' && state.buyNowItem ? [
                state.buyNowItem
            ] : state.items;
            return activeItems.reduce((acc, item)=>acc + item.price * item.quantity, 0);
        },
        getTax: ()=>{
            // 5% luxury apparel GST
            const subtotal = get().getSubtotal() - get().discountAmount;
            return Math.round(Math.max(0, subtotal * 0.05));
        },
        getDeliveryFee: ()=>{
            // Complimentary White Glove Luxury Delivery on all orders
            return 0;
        },
        getTotal: ()=>{
            const subtotal = get().getSubtotal();
            const discount = get().discountAmount;
            const tax = get().getTax();
            const delivery = get().getDeliveryFee();
            return Math.max(0, subtotal - discount + tax + delivery);
        },
        getItemCount: ()=>{
            const state = get();
            const activeItems = state.checkoutMode === 'buy_now' && state.buyNowItem ? [
                state.buyNowItem
            ] : state.items;
            return activeItems.reduce((acc, item)=>acc + item.quantity, 0);
        },
        getCartItemCount: ()=>{
            return get().items.reduce((acc, item)=>acc + item.quantity, 0);
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useStorefrontStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStorefrontStore",
    ()=>useStorefrontStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
'use client';
;
function getStoredStorefront() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // 1. Check query parameter ?storefront=b
        const urlParams = new URLSearchParams(window.location.search);
        const param = urlParams.get('storefront');
        if (param === 'a' || param === 'b') {
            return param;
        }
        // 2. Check localStorage
        const local = window.localStorage.getItem('aurelia_storefront');
        if (local === 'a' || local === 'b') {
            return local;
        }
        // 3. Check document cookie
        const match = document.cookie.match(/storefront=(a|b)/);
        if (match && (match[1] === 'a' || match[1] === 'b')) {
            return match[1];
        }
    } catch  {
    // fallback
    }
    return 'a';
}
function setStoredStorefront(id) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        window.localStorage.setItem('aurelia_storefront', id);
        document.cookie = `storefront=${id}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.setAttribute('data-storefront', id);
    } catch  {
    // ignore
    }
}
const useStorefrontStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        storefront: 'a',
        theme: 'light',
        initStorefront: ()=>{
            const id = getStoredStorefront();
            setStoredStorefront(id);
            set({
                storefront: id
            });
        },
        setStorefront: (id)=>{
            setStoredStorefront(id);
            set({
                storefront: id
            });
        },
        toggleStorefront: ()=>{
            set((state)=>{
                const next = state.storefront === 'a' ? 'b' : 'a';
                setStoredStorefront(next);
                return {
                    storefront: next
                };
            });
        },
        toggleTheme: ()=>{
            set((state)=>{
                const nextTheme = state.theme === 'light' ? 'dark' : 'light';
                if (typeof document !== 'undefined') {
                    document.documentElement.setAttribute('data-theme', nextTheme);
                }
                return {
                    theme: nextTheme
                };
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useToastStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useToastStore",
    ()=>useToastStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
'use client';
;
const useToastStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        toasts: [],
        showToast: (message, type = 'success')=>{
            const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
            set((state)=>({
                    toasts: [
                        ...state.toasts,
                        {
                            id,
                            type,
                            message
                        }
                    ]
                }));
            setTimeout(()=>{
                set((state)=>({
                        toasts: state.toasts.filter((t)=>t.id !== id)
                    }));
            }, 4000);
        },
        removeToast: (id)=>{
            set((state)=>({
                    toasts: state.toasts.filter((t)=>t.id !== id)
                }));
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/store/useWishlistStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWishlistStore",
    ()=>useWishlistStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mockApi.ts [app-client] (ecmascript)");
'use client';
;
;
const useWishlistStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        productIds: [
            'prod_001',
            'prod_004',
            'prod_008'
        ],
        isLoading: false,
        initWishlist: async (userId = 'usr_001')=>{
            set({
                isLoading: true
            });
            try {
                const ids = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWishlist"])(userId);
                set({
                    productIds: ids,
                    isLoading: false
                });
            } catch  {
                set({
                    isLoading: false
                });
            }
        },
        toggleItem: async (productId, userId = 'usr_001')=>{
            // Optimistic update
            const current = get().productIds;
            const exists = current.includes(productId);
            const updated = exists ? current.filter((id)=>id !== productId) : [
                ...current,
                productId
            ];
            set({
                productIds: updated
            });
            try {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mockApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toggleWishlist"])(userId, productId);
            } catch  {
                // Revert if error
                set({
                    productIds: current
                });
            }
        },
        isInWishlist: (productId)=>{
            return get().productIds.includes(productId);
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_14vfrx9._.js.map