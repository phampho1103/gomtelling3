import OpenAI from 'openai';

// Khởi tạo client OpenAI với API key
// Lưu ý: API key nên được lưu trong biến môi trường (.env)
// và không nên hard-code trong mã nguồn
const getApiKey = () => {
  // Kiểm tra window.env trước
  if (typeof window !== 'undefined' && window.env && window.env.REACT_APP_OPENAI_API_KEY) {
    console.log('Sử dụng API key từ window.env');
    const key = window.env.REACT_APP_OPENAI_API_KEY;
    // Kiểm tra xem API key có đúng định dạng không (bắt đầu với 'sk-')
    if (key && typeof key === 'string' && key.startsWith('sk-')) {
      return key;
    } else {
      console.error('API key từ window.env không đúng định dạng:', typeof key, key ? 'Có giá trị' : 'Không có giá trị', key ? (key.startsWith('sk-') ? 'Bắt đầu với sk-' : 'Không bắt đầu với sk-') : '');
    }
  }

  // Kiểm tra process.env
  if (process.env.REACT_APP_OPENAI_API_KEY) {
    console.log('Sử dụng API key từ process.env');
    const key = process.env.REACT_APP_OPENAI_API_KEY;
    // Kiểm tra xem API key có đúng định dạng không (bắt đầu với 'sk-')
    if (key && typeof key === 'string' && key.startsWith('sk-')) {
      return key;
    } else {
      console.error('API key từ process.env không đúng định dạng:', typeof key, key ? 'Có giá trị' : 'Không có giá trị', key ? (key.startsWith('sk-') ? 'Bắt đầu với sk-' : 'Không bắt đầu với sk-') : '');
    }
  }

  // Fallback
  console.error('API key không được cấu hình đúng cách. Vui lòng cấu hình API key trong public/env.js hoặc trong biến môi trường REACT_APP_OPENAI_API_KEY.');
  return '';
};

const apiKey = getApiKey();
console.log('API key final:', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'Không có');

let openai;
try {
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Cho phép sử dụng API key trong môi trường browser (chỉ dùng cho demo)
  });
} catch (error) {
  console.error('Lỗi khi khởi tạo OpenAI client:', error);
}

// System message mặc định
const SYSTEM_MESSAGE = `
Bạn là GomTelling – một chatbot giới thiệu văn hóa làm gốm Việt Nam.

Mỗi lần trả lời, bạn phải bắt đầu bằng câu "GomTelling xin chào".
Nhiệm vụ chính của bạn là trả lời các câu hỏi liên quan đến gốm Việt Nam, bao gồm lịch sử, làng nghề, kỹ thuật, sản phẩm và vai trò của gốm trong văn hóa dân tộc.
Bạn không thảo luận về các chủ đề không liên quan đến gốm Việt Nam.
Bạn được tạo ra bởi nhóm 5 sinh viên lớp Marketing căn bản như một phần của dự án quảng bá văn hóa Việt.
Giọng điệu thân thiện, dễ hiểu, mang tinh thần gìn giữ và lan tỏa giá trị truyền thống.
`;

/**
 * Gửi tin nhắn đến OpenAI API và nhận phản hồi
 * @param {Array} messages - Mảng các tin nhắn (bao gồm cả tin nhắn người dùng và hệ thống)
 * @returns {Promise<string>} - Phản hồi từ OpenAI
 */
export const sendMessageToOpenAI = async (messages) => {
  try {
    if (!apiKey) {
      throw new Error('Không tìm thấy API key. Vui lòng cấu hình API key.');
    }
    
    if (!openai) {
      throw new Error('OpenAI client chưa được khởi tạo.');
    }
    
    // Thêm system message vào đầu cuộc trò chuyện nếu chưa có
    const conversationWithSystem = messages.some(msg => msg.role === 'system')
      ? messages
      : [{ role: 'system', content: SYSTEM_MESSAGE }, ...messages];
    
    console.log('Gọi OpenAI API với API key:', apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 5)}` : 'Không có');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview', // Sử dụng model GPT-4.1 preview
      messages: conversationWithSystem,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Lỗi khi gọi OpenAI API:', error);
    return 'GomTelling xin chào. Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau. Lỗi: ' + (error.message || 'Không xác định');
  }
};

export default sendMessageToOpenAI;
