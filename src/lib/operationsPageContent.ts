import type { Locale } from "@/types";

interface OperationsSection {
  body: string[];
  image: string;
  items?: string[];
  title: string;
}

interface OperationsPageContent {
  closing: string;
  description: string;
  intro: string[];
  sections: OperationsSection[];
  stats: Array<{ label: string; value: string }>;
  subtitle: string;
  title: string;
}

const operationsPageContent: Record<Locale, OperationsPageContent> = {
  vi: {
    title: "Năng Lực Hoạt Động",
    subtitle: "CÔNG TY TNHH WOODLAND",
    description:
      "WOODLAND là nhà cung cấp gỗ công nghiệp chất lượng quốc tế tại Việt Nam với năng lực cung ứng mạnh, hệ thống kho xưởng hiện đại và đội ngũ vận hành chuyên nghiệp.",
    intro: [
      "WOODLAND tự hào là nhà cung cấp gỗ công nghiệp đẳng cấp quốc tế tại Việt Nam, mang đến giải pháp vật liệu tối ưu cho các dự án từ nội thất cao cấp đến xây dựng công trình quy mô lớn. Với cam kết về chất lượng và dịch vụ hàng đầu, sản phẩm của chúng tôi đã sẵn sàng đáp ứng các tiêu chuẩn khắt khe tại các thị trường khó tính như Mỹ, Châu Âu, Nhật Bản và Hàn Quốc.",
      "Được vận hành từ kho bãi hiện đại rộng hơn 10,000m² tại Bình Dương, cùng đội ngũ chuyên nghiệp và năng lực cung ứng mạnh mẽ, WOODLAND cung cấp các sản phẩm gỗ đa dạng như ván ép, gỗ ghép, MDF và ván Okal, đáp ứng yêu cầu về độ bền, thẩm mỹ và hiệu quả kinh tế cho nhiều nhóm khách hàng.",
    ],
    stats: [
      { label: "Công suất cung ứng", value: "500,000+ m³/năm" },
      { label: "Diện tích kho xưởng", value: "10,000m²" },
      { label: "Đội ngũ nhân sự", value: "50+ nhân sự" },
    ],
    sections: [
      {
        title: "Dẫn đầu trong cung cấp gỗ công nghiệp đạt chuẩn quốc tế",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883554356606-4fb0ede1f2a7bc28155c0740878990c1-1776990909858-55d44038.jpg",
        body: [
          "WOODLAND định hướng trở thành đối tác vật liệu đáng tin cậy cho các công trình nội thất, sản xuất và xây dựng yêu cầu cao về chất lượng. Chúng tôi không chỉ cung cấp sản phẩm, mà còn tập trung vào khả năng tư vấn giải pháp phù hợp với từng nhu cầu thực tế.",
          "Từ năng lực kho bãi, kiểm soát chất lượng cho đến đội ngũ hỗ trợ khách hàng, toàn bộ hệ thống vận hành của WOODLAND được xây dựng để đảm bảo tính ổn định, phản hồi nhanh và tiến độ giao hàng nhất quán.",
        ],
      },
      {
        title: "Sứ mệnh và tầm nhìn",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/w1-1752936398-1776990910477-8b8cb3da.png",
        body: [
          "WOODLAND hướng đến mục tiêu trở thành nhà cung cấp gỗ công nghiệp chất lượng quốc tế hàng đầu tại Việt Nam. Để thực hiện tầm nhìn này, chúng tôi cam kết phát triển bền vững thông qua cải tiến công nghệ, nâng cao quy trình kiểm soát chất lượng và đặt trải nghiệm khách hàng lên hàng đầu.",
          "Chúng tôi tin rằng việc cung cấp đúng vật liệu, đúng tiêu chuẩn và đúng tiến độ sẽ góp phần nâng cao chất lượng công trình cũng như tiêu chuẩn ngành gỗ công nghiệp Việt Nam trên thị trường trong nước và quốc tế.",
        ],
      },
      {
        title: "Chất lượng đảm bảo, uy tín hàng đầu",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553537093-a2cfcc8f14d0d08763206220ab8eb182-1776990911296-9f7f4568.jpg",
        body: [
          "Tại WOODLAND, chất lượng luôn là yếu tố cốt lõi. Mỗi lô hàng đều được kiểm tra cẩn thận từ khâu chọn nguyên liệu, sản xuất đến hoàn thiện để đảm bảo đáp ứng đầy đủ các tiêu chuẩn cần thiết trước khi đến tay khách hàng.",
          "Sự đầu tư kỹ lưỡng vào quy trình kiểm soát chất lượng giúp WOODLAND duy trì chất lượng ổn định và đồng nhất, qua đó xây dựng niềm tin và mối quan hệ hợp tác lâu dài với khách hàng trong nhiều nhóm dự án khác nhau.",
        ],
      },
      {
        title: "Danh mục sản phẩm chủ lực",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553031437-24d20b340019500ce8a23dc7b0c1696b-1776990911647-56cdc735.jpg",
        body: [
          "WOODLAND cung cấp danh mục gỗ công nghiệp phong phú, được chọn lọc để phục vụ linh hoạt từ thi công nội thất đến sản xuất xuất khẩu và các công trình yêu cầu cao về độ bền, tính ổn định và thẩm mỹ.",
        ],
        items: [
          "Plywood Marine chống nước cho môi trường ẩm ướt và công trình yêu cầu độ bền cao.",
          "Plywood Melamine phù hợp cho nội thất hiện đại với bề mặt thẩm mỹ, dễ vệ sinh.",
          "Plywood uốn cong cho các thiết kế sáng tạo, chi tiết bo cong và bề mặt linh hoạt.",
          "Gỗ ghép cho nội thất cần vẻ đẹp tự nhiên, độ chắc chắn và thân thiện môi trường.",
          "MDF cho các ứng dụng cần bề mặt mịn, dễ gia công và hoàn thiện sơn phủ.",
          "Ván Okal cho các ứng dụng nội thất cơ bản và nhu cầu sản xuất phổ thông.",
        ],
      },
      {
        title: "Hệ thống cơ sở hạ tầng bền vững",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/w2-1752936398-1776990912075-1f7367cf.png",
        body: [
          "Để đảm bảo chất lượng và tiến độ cung ứng, WOODLAND đầu tư hệ thống kho xưởng đạt chuẩn với diện tích khoảng 10,000m² tại Bình Dương. Hạ tầng này giúp bảo quản sản phẩm tốt hơn, hỗ trợ bốc xếp hiệu quả và duy trì trạng thái hàng hóa ổn định trước khi giao.",
          "Bên cạnh đó, đội xe gồm 5 xe tải trọng 10 tấn và 3 xe nâng công suất lớn luôn sẵn sàng phục vụ, kết hợp với đối tác vận tải đường sắt, đường biển và đường hàng không để mở rộng năng lực giao hàng trên toàn quốc.",
        ],
      },
      {
        title: "Đội ngũ nhân sự tận tâm và chuyên nghiệp",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6917722294521-ed9ce7375865466db016067c8744cc72-1776990912969-1f7a9e0a.jpg",
        body: [
          "WOODLAND sở hữu đội ngũ hơn 50 nhân sự làm việc tại các bộ phận từ bán hàng, marketing, quản lý, kế toán đến kho bãi và vận chuyển. Mỗi bộ phận đều được tổ chức để phối hợp nhanh, rõ vai trò và bám sát tiến độ thực tế của khách hàng.",
          "Chúng tôi luôn sẵn sàng giải đáp thắc mắc, tư vấn đúng nhu cầu, phản hồi nhanh và đồng hành cùng khách hàng từ giai đoạn tìm hiểu sản phẩm đến giao hàng và hỗ trợ sau bán.",
        ],
      },
    ],
    closing:
      "Hãy đến với WOODLAND để nhận giải pháp gỗ công nghiệp chất lượng quốc tế, phù hợp cho nội thất, sản xuất và công trình cần tiến độ ổn định, dịch vụ rõ ràng và năng lực cung ứng mạnh.",
  },
  en: {
    title: "Operating Capacity",
    subtitle: "WOODLAND COMPANY LIMITED",
    description:
      "WOODLAND is an international-standard industrial wood supplier in Vietnam with strong supply capacity, modern warehouse infrastructure and a responsive operating team.",
    intro: [
      "WOODLAND is proud to deliver industrial wood solutions for projects ranging from premium interior fit-out to large-scale construction and manufacturing. Our system is built around stable quality, responsive service and supply readiness for demanding markets such as the United States, Europe, Japan and Korea.",
      "With more than 10,000m² of warehouse operations in Binh Duong and a professional support team, WOODLAND supplies plywood, finger-joint wood, MDF and particle board for customers who need dependable materials, consistent fulfillment and practical product guidance.",
    ],
    stats: [
      { label: "Annual supply capacity", value: "500,000+ m³/year" },
      { label: "Warehouse footprint", value: "10,000m²" },
      { label: "Operational team", value: "50+ staff" },
    ],
    sections: [
      {
        title: "Leading industrial wood supply with international standards",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883554356606-4fb0ede1f2a7bc28155c0740878990c1-1776990909858-55d44038.jpg",
        body: [
          "WOODLAND positions itself as a reliable materials partner for interior, manufacturing and construction projects that demand stable quality and consistent execution. We focus not only on supplying products, but also on helping customers select the right solution for real project conditions.",
          "From warehousing and quality control to customer support and delivery coordination, the operating system is designed to keep response times fast, service clear and fulfillment dependable.",
        ],
      },
      {
        title: "Vision and mission",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/w1-1752936398-1776990910477-8b8cb3da.png",
        body: [
          "WOODLAND aims to become a leading international-standard industrial wood supplier in Vietnam. To achieve that goal, the company continues to improve technology, refine quality control processes and keep customer experience at the center of daily operations.",
          "Supplying the right material, with the right standard and at the right time, is a core part of how Woodland supports project value and long-term customer trust.",
        ],
      },
      {
        title: "Quality assurance and trusted service",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553537093-a2cfcc8f14d0d08763206220ab8eb182-1776990911296-9f7f4568.jpg",
        body: [
          "Quality remains a core operating principle at WOODLAND. Each shipment is checked carefully from raw material selection through production and finishing to ensure the final product meets the expected standards before dispatch.",
          "This disciplined process helps Woodland maintain consistent product quality, reduce avoidable risk in execution and build long-term relationships with customers across multiple use cases.",
        ],
      },
      {
        title: "Main product portfolio",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6883553031437-24d20b340019500ce8a23dc7b0c1696b-1776990911647-56cdc735.jpg",
        body: [
          "WOODLAND supplies a broad industrial wood portfolio selected for interior fit-out, export manufacturing and projects that need dependable performance, clean finishes and flexible application options.",
        ],
        items: [
          "Marine plywood for humid environments and projects that need stronger moisture resistance.",
          "Melamine plywood for modern interiors requiring cleaner finishes and easier maintenance.",
          "Flexible plywood for creative interior work, curved details and softer forms.",
          "Finger-joint wood for applications that value natural appearance and solid structure.",
          "MDF for smooth surfaces, easier machining and paint-friendly finishing.",
          "Particle board for practical furniture and general manufacturing use cases.",
        ],
      },
      {
        title: "Sustainable infrastructure system",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/w2-1752936398-1776990912075-1f7367cf.png",
        body: [
          "To support quality and delivery performance, WOODLAND invests in warehouse infrastructure of around 10,000m² in Binh Duong. This setup improves preservation, handling and dispatch so goods remain in stronger condition before delivery.",
          "The operation is supported by 5 trucks with 10-ton capacity and 3 heavy-duty forklifts, alongside rail, sea and air logistics partners that help Woodland deliver across Vietnam with better speed and scheduling control.",
        ],
      },
      {
        title: "Dedicated and professional team",
        image:
          "https://pub-af309aad38b04a5288f51e1a0f26f628.r2.dev/operations-page/z6917722294521-ed9ce7375865466db016067c8744cc72-1776990912969-1f7a9e0a.jpg",
        body: [
          "WOODLAND has more than 50 staff working across sales, marketing, management, accounting, warehousing and transport. The structure is designed to keep responsibilities clear and customer coordination efficient throughout the process.",
          "The team is ready to answer questions, advise quickly, respond to practical needs and support customers from product selection through delivery and post-sales follow-up.",
        ],
      },
    ],
    closing:
      "Work with WOODLAND for international-standard industrial wood solutions backed by dependable supply, practical service and an operating system built for real project delivery.",
  },
};

export function getOperationsPageContent(locale: Locale) {
  return operationsPageContent[locale];
}
