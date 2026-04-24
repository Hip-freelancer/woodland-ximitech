import type { FaqItem, Locale, Product } from "@/types";

export function getHomeFaqItems(locale: Locale): FaqItem[] {
  if (locale === "vi") {
    return [
      {
        answer:
          "Woodland cung cấp plywood, plywood melamine, plywood marine, ván phủ veneer, gỗ cao su ghép finger và các dòng gỗ công nghiệp phục vụ nội thất, sản xuất và công trình.",
        order: 0,
        question: "Woodland cung cấp những dòng gỗ ván ép nào?",
      },
      {
        answer:
          "Có. Woodland có kho xưởng và năng lực cung ứng tại Bình Dương, hỗ trợ khách hàng cần ván ép, plywood và gỗ công nghiệp ở khu vực Bình Dương, TP.HCM và các tỉnh lân cận.",
        order: 1,
        question: "Woodland có cung cấp ván ép tại Bình Dương không?",
      },
      {
        answer:
          "Tùy nhu cầu sử dụng, đội ngũ Woodland tư vấn theo loại bề mặt, độ dày, tiêu chuẩn keo, chứng nhận, môi trường sử dụng và tiến độ giao hàng.",
        order: 2,
        question: "Làm sao chọn đúng loại plywood cho dự án?",
      },
      {
        answer:
          "Khách hàng có thể liên hệ hotline hoặc gửi yêu cầu qua form. Woodland sẽ phản hồi về chủng loại, quy cách, số lượng và thời gian giao hàng phù hợp.",
        order: 3,
        question: "Tôi cần báo giá gỗ ván ép thì liên hệ thế nào?",
      },
    ];
  }

  return [
    {
      answer:
        "Woodland supplies plywood, melamine plywood, marine plywood, veneered plywood, finger-joint rubberwood and industrial wood panels for interiors, manufacturing and construction.",
      order: 0,
      question: "What wood panel products does Woodland supply?",
    },
    {
      answer:
        "Yes. Woodland operates with warehouse and supply capacity in Binh Duong, supporting plywood and industrial wood buyers across Binh Duong, Ho Chi Minh City and nearby provinces.",
      order: 1,
      question: "Does Woodland supply plywood in Binh Duong?",
    },
    {
      answer:
        "Woodland recommends materials based on surface finish, thickness, bonding standard, certification, application environment and delivery timeline.",
      order: 2,
      question: "How should buyers choose the right plywood?",
    },
    {
      answer:
        "Buyers can contact Woodland by hotline or request form. The team will respond with product options, specifications, quantity planning and delivery timing.",
      order: 3,
      question: "How can I request a quotation?",
    },
  ];
}

export function getProductFallbackFaqItems(
  product: Product,
  locale: Locale
): FaqItem[] {
  if (product.faqItems && product.faqItems.length > 0) {
    return product.faqItems;
  }

  const category = product.categoryLabel ?? product.category;
  const thickness = product.thickness.length > 0
    ? `${product.thickness.join(", ")}mm`
    : "";
  const certifications = product.certifications.join(", ");

  if (locale === "vi") {
    return [
      {
        answer: `${product.name} thuộc nhóm ${category || "sản phẩm gỗ công nghiệp"} của Woodland. Sản phẩm phù hợp để khách hàng tham khảo theo nhu cầu nội thất, sản xuất hoặc công trình cần vật liệu ổn định.`,
        order: 0,
        question: `${product.name} phù hợp với nhu cầu nào?`,
      },
      {
        answer: thickness
          ? `Độ dày đang ghi nhận cho sản phẩm gồm ${thickness}. Khách hàng nên liên hệ Woodland để kiểm tra tồn kho và quy cách trước khi đặt hàng.`
          : "Quy cách có thể thay đổi theo từng lô hàng. Khách hàng nên liên hệ Woodland để kiểm tra độ dày, khổ ván và tồn kho thực tế.",
        order: 1,
        question: "Sản phẩm có những độ dày hoặc quy cách nào?",
      },
      {
        answer: certifications
          ? `Thông tin chứng nhận/tiêu chuẩn đang ghi nhận: ${certifications}. Woodland có thể tư vấn thêm theo yêu cầu dự án và thị trường xuất khẩu.`
          : "Woodland sẽ tư vấn tiêu chuẩn, chứng nhận và điều kiện sử dụng phù hợp theo từng nhu cầu thực tế.",
        order: 2,
        question: "Sản phẩm có chứng nhận hoặc tiêu chuẩn gì?",
      },
      {
        answer:
          "Bạn có thể gửi yêu cầu qua trang liên hệ hoặc gọi hotline Woodland để được tư vấn chủng loại, báo giá, số lượng và phương án giao hàng tại Bình Dương hoặc các khu vực khác.",
        order: 3,
        question: "Làm sao nhận báo giá sản phẩm này?",
      },
    ];
  }

  return [
    {
      answer: `${product.name} belongs to Woodland's ${category || "industrial wood panel"} range and can be reviewed for interior, manufacturing or project applications that require stable panel materials.`,
      order: 0,
      question: `What is ${product.name} suitable for?`,
    },
    {
      answer: thickness
        ? `Recorded thickness options include ${thickness}. Buyers should contact Woodland to confirm stock, panel size and current availability.`
        : "Specifications may vary by batch. Buyers should contact Woodland to confirm thickness, panel size and current stock.",
      order: 1,
      question: "What thickness or specifications are available?",
    },
    {
      answer: certifications
        ? `Recorded certifications or standards include: ${certifications}. Woodland can advise based on project and export-market requirements.`
        : "Woodland can advise on standards, certifications and application requirements for each project.",
      order: 2,
      question: "Does this product have certifications or standards?",
    },
    {
      answer:
        "You can request a quotation through the contact page or Woodland hotline for product selection, pricing, quantity planning and delivery options.",
      order: 3,
      question: "How can I request a quotation for this product?",
    },
  ];
}
