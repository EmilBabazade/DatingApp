using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDTO>()
                .ForMember(
                    dest => dest.PhotoUrl,
                    opts => opts.MapFrom(
                        src => src.Photos.FirstOrDefault(x => x.IsMain).Url)
                    )
                .ForMember(
                    dest => dest.Age,
                    opts => opts.MapFrom(
                        src => src.DateOfBirth.CalculateAge())
                );
            CreateMap<Photo, PhotoDTO>();
            CreateMap<MemberUpdateDTO, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(
                    dest => dest.RecipeintPhotoUrl,
                    opts => opts.MapFrom(
                        src => src.Recipeint.Photos.FirstOrDefault(p => p.IsMain).Url)
                )
                .ForMember(
                    dest => dest.SenderPhotoUrl,
                    opts => opts.MapFrom(
                        src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url)
                );
        }
    }
}
