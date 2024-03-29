import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import useModal from '../hooks/useModal';
import useDiary from '../hooks/service/useDiary';
import type { RootState } from '../modules';
import { getDateString } from '../utils/utils';
import Modal from '../components/modal';
import ItemForm from '../components/diary/ItemForm';
import type {
  DiaryItemParams,
  LocationState,
} from '../components/diary/DiaryDetailContainer';

export default function DiaryItemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const { id: itemId } = useParams<keyof DiaryItemParams>() as DiaryItemParams;
  const { isShowing, openModal, closeModal } = useModal();
  const { onDeleteItem, onEditItem } = useDiary();
  const categoryId = location.pathname.split('/')[2] || state.id;

  const items = useSelector(
    (state: RootState) =>
      state.diary.find((cat) => cat.id === +location.pathname.split('/')[2])
        ?.items
  );

  const item = items?.find((item) => item.id === +itemId);

  const handleDeleteItem = () => {
    if (!window.confirm(`${item?.title}을(를) 삭제하시겠습니까?`)) return;
    onDeleteItem(+categoryId, +itemId);
  };

  const handleEditItem = (title: string, content: string, emoji: string) => {
    onEditItem(+categoryId, +itemId, title, content, emoji);
    closeModal();
  };

  return (
    <div className="w-full tablet:w-3/5">
      <div className="bg-white p-4 tablet:p-6 dark:bg-opacity-20 dark:text-white">
        <div className="w-full flex flex-wrap items-center justify-between border-b border-black pb-3 dark:border-white">
          <h3 className="font-bold text-sm tablet:text-base">{item?.title}</h3>
          <button
            className="text-xs tablet:text-sm hover:font-bold select-none"
            onClick={() => navigate(`/diary/${categoryId}`)}
          >
            닫기
          </button>
        </div>
        <p className="text-sm tablet:text-base my-6 whitespace-pre-line text-stone-800 dark:text-stone-200">
          {item?.content}
        </p>

        <div className="flex items-center justify-between text-xs tablet:text-sm">
          <h4 className="text-xs">
            {getDateString('locale', item?.createDate as number)}{' '}
            <span className="text-base">{item?.emoji}</span>
          </h4>
          <div className="flex items-center select-none group">
            <div className="hidden group-hover:block">
              <button className="ml-1 hover:font-bold" onClick={openModal}>
                수정
              </button>
              <button
                className="ml-1 hover:font-bold"
                onClick={handleDeleteItem}
              >
                삭제
              </button>
            </div>
            <div className="font-bold cursor-pointer ml-2">☰</div>
          </div>
        </div>
      </div>

      {isShowing && (
        <Modal>
          <ItemForm
            prevData={{
              prevTitle: item?.title as string,
              prevContent: item?.content as string,
              prevEmoji: item?.emoji as string,
            }}
            onClick={handleEditItem}
            handleCloseModal={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
