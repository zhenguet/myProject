import { between } from 'react-native-redash';

/** tính index tương đối của phần tử đang thao tác */
export const calPosition = (offset: any, offsets: Array<any>) => {
  'worklet';

  // sắp xếp theo order
  const _offsets = [...offsets].sort(
    (first, second) => first.originalOrder.value - second.originalOrder.value,
  );

  const x = offset.x.value;
  const y = offset.y.value;
  const width = offset.width.value;
  const height = offset.height.value;

  // tìm phần tử đầu tiên trong list có thể đảo vị trí
  let _offset = _offsets.find(
    os =>
      (between(
        x + width / 4,
        os.originalX.value,
        os.originalX.value + os.width.value,
      ) ||
        between(
          x + (width * 3) / 4,
          os.originalX.value,
          os.originalX.value + os.width.value,
        )) &&
      (between(
        y + height / 4,
        os.originalY.value,
        os.originalY.value + os.height.value,
      ) ||
        between(
          y + (height * 3) / 4,
          os.originalY.value,
          os.originalY.value + os.height.value,
        )),
  );

  // nếu ko có thì tìm phần tử đầu tiên trong hàng có thể đảo vị trí
  if (!_offset) {
    _offset = _offsets.find(
      os =>
        x < os.originalX.value &&
        between(y, os.originalY.value, os.originalY.value + os.height.value),
    );
  }

  if (_offset) {
    return _offset.originalOrder.value;
  }

  // nếu ko có thì xem item đã di chuyển ra đầu danh sách chưa => index = 0
  if (x < _offsets[0].originalX.value && y < _offsets[0].originalY.value) {
    return 0;
  }

  // ko hợp lệ xếp về cuối
  return _offsets.length - 1;
};

/** di chuyển các phần tử khác */
export const move = (
  oldIndex: number,
  newIndex: number,
  offsets: Array<any>,
) => {
  'worklet';
  const selecting = offsets.find(x => x.originalOrder.value === oldIndex);
  // cập nhật order hiện tại
  selecting.order.value = newIndex;

  offsets.forEach(item => {
    let originalOrder = item.originalOrder.value;
    // cập nhật order và toạ độ các điểm khác
    if (originalOrder !== oldIndex) {
      // những phần tử nằm giữa newIndex và oldIndex là bị thay đổi order
      if (
        (originalOrder <= newIndex &&
          originalOrder > oldIndex &&
          newIndex > oldIndex) ||
        (originalOrder >= newIndex &&
          originalOrder < oldIndex &&
          newIndex < oldIndex)
      ) {
        if (originalOrder < oldIndex) {
          originalOrder += 1;
        } else {
          originalOrder -= 1;
        }
      }

      // cập nhật vị trí tất cả
      item.x.value = (originalOrder % 4) * item.width.value;
      item.y.value = Math.floor(originalOrder / 4) * item.height.value;
    }
  });
};

/** cập nhật giá trị tất cả */
export const setPosition = (offset: any, offsets: Array<any>) => {
  'worklet';
  const oldIndex = offset.originalOrder.value;
  const newIndex = offset.order.value;

  // cập nhật original cho các phần tử khác
  offsets.forEach((item: any) => {
    let originalOrder = item.originalOrder.value;
    if (originalOrder !== oldIndex) {
      if (
        (originalOrder <= newIndex &&
          originalOrder > oldIndex &&
          newIndex > oldIndex) ||
        (originalOrder >= newIndex &&
          originalOrder < oldIndex &&
          newIndex < oldIndex)
      ) {
        if (originalOrder < oldIndex) {
          originalOrder += 1;
        } else {
          originalOrder -= 1;
        }
      }
      item.order.value = originalOrder;
      item.originalOrder.value = originalOrder;
    }
  });

  // cập nhật giá trị cho phần tử hiện tại
  offset.originalOrder.value = newIndex;
  offset.x.value = (newIndex % 4) * offset.width.value;
  offset.y.value = Math.floor(newIndex / 4) * offset.height.value;
  offset.originalX.value = (newIndex % 4) * offset.width.value;
  offset.originalY.value = Math.floor(newIndex / 4) * offset.height.value;
};
