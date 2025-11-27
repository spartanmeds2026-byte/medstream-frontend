export function addOptionsToSelector(
	formJson: any,
	selectorKey: any,
	newOptions: any
) {
	function updateOptions(components: any) {
		components.forEach((component: any) => {
			if (component.type === "select" && component.key === selectorKey) {
				if (component.data && component.data.values) {
					component.data.values = newOptions
				} else {
					component.data = { values: newOptions }
				}
			} else if (component.columns) {
				component.columns.forEach((column: any) =>
					updateOptions(column.components)
				)
			} else if (component.components) {
				updateOptions(component.components)
			}
		})
	}

	updateOptions(formJson.components)
	return formJson
}

export function addPropsToComponent(
	formJson: any,
	selectorKey: any,
	newProps: any
) {
	function updateOptions(components: any) {
		components.forEach((component: any) => {
			if (component.key === selectorKey) {
				component = Object.assign(component, newProps)
			} else if (component.columns) {
				component.columns.forEach((column: any) =>
					updateOptions(column.components)
				)
			} else if (component.components) {
				updateOptions(component.components)
			}
		})
	}

	updateOptions(formJson.components)
	return formJson
}
