import { useParams } from "react-router-dom";
import { AccountLayout } from "../components/AccountLayout";
import { OrderDetail } from "../components/OrderDetail";

export function OrderDetailPage() {
  const { id } = useParams();

  return (
    <AccountLayout>
      <OrderDetail orderId={id} />
    </AccountLayout>
  );
}
