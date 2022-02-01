
const transporter = {
    verify: jest.fn(),
    sendMail: jest.fn()
}
    
export default {
    createTransport: jest.fn(() => transporter)
}