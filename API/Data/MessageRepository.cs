using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessageAsync(int id, bool includeSender = false, bool includeRecipient = false)
        {
            IQueryable<Message> messages = _context.Messages.AsQueryable();
            if (includeSender) messages = messages.Include(u => u.Sender);
            if (includeRecipient) messages = messages.Include(u => u.Recipeint);
            return await messages.SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUserAsync(MessageParams messageParams)
        {
            IQueryable<Message> query = _context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recipeint.UserName == messageParams.Username && u.RecipientDeleted == false),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username && u.SenderDeleted == false),
                _ => query.Where(u => u.Recipeint.UserName == messageParams.Username && u.RecipientDeleted == false && u.DateRead == null), // "Unread"
            };

            IQueryable<MessageDto> messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThreadAsync(string currentUsername, string recipientUsername)
        {
            List<Message> messages = await _context.Messages
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipeint).ThenInclude(p => p.Photos)
                .Where(m =>
                    m.RecipientDeleted == false &&
                    m.Recipeint.UserName == currentUsername && m.Sender.UserName == recipientUsername ||
                    m.SenderDeleted == false &&
                    m.Recipeint.UserName == recipientUsername && m.Sender.UserName == currentUsername)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();

            List<Message> unreadMessages = messages.Where(m => m.DateRead == null && m.Recipeint.UserName == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach (Message message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
