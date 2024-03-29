import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useCalendar from '../../hooks/service/useCalendar';

type LocationState = {
  year: string;
  month: string;
  day: string;
  text: string;
};

const CalendarForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { onCreateOrUpdateSchedule, onDeleteSchedule } = useCalendar();
  const { year, month, day, text } = location.state as LocationState;
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState('');
  const [newText, setNewText] = useState(text);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  };

  const handleAddSchedule = () => {
    if (newText.trim().length < 1) return;
    if (newText.length > 20) {
      setError('20자 이하로 입력해 주세요');
      return;
    } else setError('');
    onCreateOrUpdateSchedule(+year, +month, +day, newText);
    setEdit(false);
  };

  const handleDeleteSchedule = () => {
    if (!window.confirm('스케줄을 삭제하시겠습니까?')) return;
    onDeleteSchedule(+year, +month, +day);
    setNewText('');
  };

  const handleCancelSchedule = () => {
    setNewText('');
    setEdit(false);
  };

  return (
    <div className="flex flex-col tablet:w-80">
      <h1 className="font-bold text-lg border-b pb-1 dark:text-white">
        {year}.{month}.{day}
      </h1>

      {!edit ? (
        <>
          <p className="px-1 mt-2 mb-4 dark:text-white">
            {newText === '' ? '아직 스케줄이 없습니다' : newText}
          </p>
          <div className="flex items-center">
            <button
              onClick={() => setEdit(true)}
              className="calendar-form_button bg-red-100"
            >
              {newText === '' ? '추가' : '수정'}
            </button>
            {newText && (
              <button
                onClick={handleDeleteSchedule}
                className="calendar-form_button bg-red-300"
              >
                삭제
              </button>
            )}
            <button
              onClick={() => navigate('/calendar')}
              className="calendar-form_button bg-gray-200"
            >
              닫기
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            className="border px-1 my-3"
            value={newText}
            onChange={onChange}
            placeholder="스케줄을 입력해 주세요"
            required
          />
          {error && (
            <p className="text-sm text-blue-600 ml-1 -mt-2 mb-1">{error}</p>
          )}
          <div className="flex items-center">
            <button
              className="bg-stone-400 calendar-form_button"
              onClick={handleAddSchedule}
            >
              확인
            </button>
            <button
              className="bg-stone-200 calendar-form_button"
              onClick={handleCancelSchedule}
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarForm;
