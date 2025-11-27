import Layout from "@/themes"
export default [
	{
		path: "/template/login",
		name: "login-template",
		component: () => import("../pages/Template/Login.vue"),
	},
	{
		path: "/template/register",
		name: "register-template",
		component: () => import("../pages/Template/Register.vue"),
	},
	{
		path: "/template",
		component: Layout,
		meta: { requiresAuth: true },
		children: [
			{
				path: "/blank",
				name: "blank",
				component: () => import("../pages/Template/_S9/Blank.vue"),
			},
			{
				path: "/formio",
				name: "formio",
				component: () => import("../pages/Template/_S9/FormDemo.vue"),
			},
			{
				path: "/formio-builder",
				name: "formio-builder",
				component: () => import("../pages/Template/_S9/FormDemoBuilder.vue"),
			},
			{
				path: "dashboard-overview-1",
				name: "dashboard-overview-1",
				component: () => import("../pages/Template/DashboardOverview1.vue"),
			},
			{
				path: "dashboard-overview-2",
				name: "dashboard-overview-2",
				component: () => import("../pages/Template/DashboardOverview2.vue"),
			},
			{
				path: "dashboard-overview-3",
				name: "dashboard-overview-3",
				component: () => import("../pages/Template/DashboardOverview3.vue"),
			},
			{
				path: "dashboard-overview-4",
				name: "dashboard-overview-4",
				component: () => import("../pages/Template/DashboardOverview4.vue"),
			},
			{
				path: "categories",
				name: "categories-1",
				component: () => import("../pages/Template/Categories.vue"),
			},
			{
				path: "add-product",
				name: "add-product",
				component: () => import("../pages/Template/AddProduct.vue"),
			},
			{
				path: "product-list",
				name: "product-list",
				component: () => import("../pages/Template/ProductList.vue"),
			},
			{
				path: "product-grid",
				name: "product-grid",
				component: () => import("../pages/Template/ProductGrid.vue"),
			},
			{
				path: "transaction-list",
				name: "transaction-list",
				component: () => import("../pages/Template/TransactionList.vue"),
			},
			{
				path: "transaction-detail",
				name: "transaction-detail",
				component: () => import("../pages/Template/TransactionDetail.vue"),
			},
			{
				path: "seller-list",
				name: "seller-list",
				component: () => import("../pages/Template/SellerList.vue"),
			},
			{
				path: "seller-detail",
				name: "seller-detail",
				component: () => import("../pages/Template/SellerDetail.vue"),
			},
			{
				path: "reviews",
				name: "reviews",
				component: () => import("../pages/Template/Reviews.vue"),
			},
			{
				path: "inbox",
				name: "inbox",
				component: () => import("../pages/Template/Inbox.vue"),
			},
			{
				path: "file-manager",
				name: "file-manager",
				component: () => import("../pages/Template/FileManager.vue"),
			},
			{
				path: "point-of-sale",
				name: "point-of-sale",
				component: () => import("../pages/Template/PointOfSale.vue"),
			},
			{
				path: "chat",
				name: "chat",
				component: () => import("../pages/Template/Chat.vue"),
			},
			{
				path: "post",
				name: "post",
				component: () => import("../pages/Template/Post.vue"),
			},
			{
				path: "calendar",
				name: "calendar",
				component: () => import("../pages/Template/Calendar.vue"),
			},
			{
				path: "crud-data-list",
				name: "crud-data-list",
				component: () => import("../pages/Template/CrudDataList.vue"),
			},
			{
				path: "crud-form",
				name: "crud-form",
				component: () => import("../pages/Template/CrudForm.vue"),
			},
			{
				path: "users-layout-1",
				name: "users-layout-1",
				component: () => import("../pages/Template/UsersLayout1.vue"),
			},
			{
				path: "users-layout-2",
				name: "users-layout-2",
				component: () => import("../pages/Template/UsersLayout2.vue"),
			},
			{
				path: "users-layout-3",
				name: "users-layout-3",
				component: () => import("../pages/Template/UsersLayout3.vue"),
			},
			{
				path: "profile-overview-1",
				name: "profile-overview-1",
				component: () => import("../pages/Template/ProfileOverview1.vue"),
			},
			{
				path: "profile-overview-2",
				name: "profile-overview-2",
				component: () => import("../pages/Template/ProfileOverview2.vue"),
			},
			{
				path: "profile-overview-3",
				name: "profile-overview-3",
				component: () => import("../pages/Template/ProfileOverview3.vue"),
			},
			{
				path: "wizard-layout-1",
				name: "wizard-layout-1",
				component: () => import("../pages/Template/WizardLayout1.vue"),
			},
			{
				path: "wizard-layout-2",
				name: "wizard-layout-2",
				component: () => import("../pages/Template/WizardLayout2.vue"),
			},
			{
				path: "wizard-layout-3",
				name: "wizard-layout-3",
				component: () => import("../pages/Template/WizardLayout3.vue"),
			},
			{
				path: "blog-layout-1",
				name: "blog-layout-1",
				component: () => import("../pages/Template/BlogLayout1.vue"),
			},
			{
				path: "blog-layout-2",
				name: "blog-layout-2",
				component: () => import("../pages/Template/BlogLayout2.vue"),
			},
			{
				path: "blog-layout-3",
				name: "blog-layout-3",
				component: () => import("../pages/Template/BlogLayout3.vue"),
			},
			{
				path: "pricing-layout-1",
				name: "pricing-layout-1",
				component: () => import("../pages/Template/PricingLayout1.vue"),
			},
			{
				path: "pricing-layout-2",
				name: "pricing-layout-2",
				component: () => import("../pages/Template/PricingLayout2.vue"),
			},
			{
				path: "invoice-layout-1",
				name: "invoice-layout-1",
				component: () => import("../pages/Template/InvoiceLayout1.vue"),
			},
			{
				path: "invoice-layout-2",
				name: "invoice-layout-2",
				component: () => import("../pages/Template/InvoiceLayout2.vue"),
			},
			{
				path: "faq-layout-1",
				name: "faq-layout-1",
				component: () => import("../pages/Template/FaqLayout1.vue"),
			},
			{
				path: "faq-layout-2",
				name: "faq-layout-2",
				component: () => import("../pages/Template/FaqLayout2.vue"),
			},
			{
				path: "faq-layout-3",
				name: "faq-layout-3",
				component: () => import("../pages/Template/FaqLayout3.vue"),
			},
			{
				path: "update-profile",
				name: "update-profile",
				component: () => import("../pages/Template/UpdateProfile.vue"),
			},
			{
				path: "change-password",
				name: "change-password",
				component: () => import("../pages/Template/ChangePassword.vue"),
			},
			{
				path: "regular-table",
				name: "regular-table",
				component: () => import("../pages/Template/RegularTable.vue"),
			},
			{
				path: "tabulator",
				name: "tabulator",
				component: () => import("../pages/Template/Tabulator.vue"),
			},
			{
				path: "modal",
				name: "modal",
				component: () => import("../pages/Template/Modal.vue"),
			},
			{
				path: "slide-over",
				name: "slide-over",
				component: () => import("../pages/Template/Slideover.vue"),
			},
			{
				path: "notification",
				name: "notification",
				component: () => import("../pages/Template/Notification.vue"),
			},
			{
				path: "tab",
				name: "tab",
				component: () => import("../pages/Template/Tab.vue"),
			},
			{
				path: "accordion",
				name: "accordion",
				component: () => import("../pages/Template/Accordion.vue"),
			},
			{
				path: "button",
				name: "button",
				component: () => import("../pages/Template/Button.vue"),
			},
			{
				path: "alert",
				name: "alert",
				component: () => import("../pages/Template/Alert.vue"),
			},
			{
				path: "progress-bar",
				name: "progress-bar",
				component: () => import("../pages/Template/ProgressBar.vue"),
			},
			{
				path: "tooltip",
				name: "tooltip",
				component: () => import("../pages/Template/Tooltip.vue"),
			},
			{
				path: "dropdown",
				name: "dropdown",
				component: () => import("../pages/Template/Dropdown.vue"),
			},
			{
				path: "typography",
				name: "typography",
				component: () => import("../pages/Template/Typography.vue"),
			},
			{
				path: "icon",
				name: "icon",
				component: () => import("../pages/Template/Icon.vue"),
			},
			{
				path: "loading-icon",
				name: "loading-icon",
				component: () => import("../pages/Template/LoadingIcon.vue"),
			},
			{
				path: "regular-form",
				name: "regular-form",
				component: () => import("../pages/Template/RegularForm.vue"),
			},
			{
				path: "datepicker",
				name: "datepicker",
				component: () => import("../pages/Template/Datepicker.vue"),
			},
			{
				path: "tom-select",
				name: "tom-select",
				component: () => import("../pages/Template/TomSelect.vue"),
			},
			{
				path: "file-upload",
				name: "file-upload",
				component: () => import("../pages/Template/FileUpload.vue"),
			},
			{
				path: "wysiwyg-editor",
				name: "wysiwyg-editor",
				component: () => import("../pages/Template/WysiwgEditor.vue"),
			},
			{
				path: "validation",
				name: "validation",
				component: () => import("../pages/Template/Validation.vue"),
			},
			{
				path: "chart",
				name: "chart",
				component: () => import("../pages/Template/Chart.vue"),
			},
			{
				path: "slider",
				name: "slider",
				component: () => import("../pages/Template/Slider.vue"),
			},
			{
				path: "image-zoom",
				name: "image-zoom",
				component: () => import("../pages/Template/ImageZoom.vue"),
			},
		],
	},
]
