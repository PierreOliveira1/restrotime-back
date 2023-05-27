function mergeObjects<T extends object, U extends object>(obj1: T, obj2: U): T & U {
	const merged = { ...obj1 };

	Object.keys(obj2).forEach((key) => {
		if (Object.prototype.hasOwnProperty.call(obj2, key)) {
			const propertyObj2 = Object.getOwnPropertyDescriptor(obj2, key);
			const propertyObj1 = Object.getOwnPropertyDescriptor(obj1, key);

			if (
				Array.isArray(propertyObj2?.value) &&
				Object.prototype.hasOwnProperty.call(obj1, key) &&
				Array.isArray(propertyObj1?.value)
			) {
				Object.defineProperty(merged, key, {
					value: Array.prototype.concat(
						propertyObj1?.value,
						propertyObj2?.value,
					),
					writable: true,
					enumerable: true,
					configurable: true,
				});
			} else if (
				typeof propertyObj2?.value === 'object' &&
				Object.prototype.hasOwnProperty.call(obj1, key) &&
				typeof propertyObj1?.value === 'object' &&
				!Array.isArray(propertyObj2?.value) &&
				!Array.isArray(propertyObj1?.value)
			) {
				Object.defineProperty(merged, key, {
					value: mergeObjects(propertyObj1?.value, propertyObj2?.value),
					writable: true,
					enumerable: true,
					configurable: true,
				});
			} else {
				Object.defineProperty(merged, key, {
					value: propertyObj2?.value,
					writable: true,
					enumerable: true,
					configurable: true,
				});
			}
		}
	});

	return merged as T & U;
};

export { mergeObjects };
