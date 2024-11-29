import { format } from "date-fns";
import { FullOrderPayload, OrderDetails, OrderDetailsProduct, OrderDetailsImage } from "./OrderDetails";

export class Mappers {
    static fromFullOrderPayloadToOrderDetails(
        order: FullOrderPayload
    ): OrderDetails {
        const products: OrderDetailsProduct[] = []
        order.orderItems.forEach((item) => {
            const images: OrderDetailsImage[] = []
            products.push({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price.toNumber(),
                discount: item.product.discount.toNumber(),
                discountedPrice: item.product.discountedPrice?.toNumber() || 0,
                description: item.product.description,
                color: {
                    name: item.product.color.name,
                    value: item.product.color.value,
                },
                size: {
                    name: item.product.size.name,
                    value: item.product.size.value,
                },
                category: {
                    name: item.product.category.name,
                    iconUrl: item.product.category.iconUrl,
                },
                images
            })

            item.product.images.forEach(item => {
                images.push({
                    id: item.id,
                    url: item.url
                })
            })
        })
        return {
            id: order.id,
            storeId: order.storeId,
            isPaid: order.isPaid,
            address: order.address,
            status: order.status,
            createdAt: format(order.createdAt, "MMMM do, yyyy"),
            updatedAt: format(order.createdAt, "MMMM do, yyyy"),
            customer: {
                id: order.Customer?.id || "",
                fullname: (order.Customer?.firstName || "") + (order.Customer?.lastName || ""),
                email: order.Customer?.email || "",
                phone: order.Customer?.phone || "",
            },
            payment: {
                id: order.payment?.id || "",
                ref: order.payment?.reference || "",
                amount: order.payment?.amount || 0,
                status: order.payment?.status || "",
                paidAt: format(order.payment?.paidAt || new Date(), "MMMM do, yyyy"),
                currency: order.payment?.currency || "",
                fees: order.payment?.fees || 0,
                cardType: order.payment?.cardType || "",
                bank: order.payment?.bank || "",
                accountName: order.payment?.accountName || "",
            },
            products
        };
    }
}
