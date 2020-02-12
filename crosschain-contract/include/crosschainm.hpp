#pragma once
#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/symbol.hpp>
#include <eosio/crypto.hpp>
#include <eosio/transaction.hpp>
#include <eosio/singleton.hpp>
#include <eosio/contract.hpp>

#define SIMPLEASSETS_CONTRACT "simpleassets"_n

using namespace eosio;

CONTRACT crosschainm : public contract {
  public:
    using contract::contract;

    ACTION transfernft(eosio::name from, eosio::name to , std::vector<uint64_t>& assetids, std::string memo);
    ACTION transferft(eosio::name from, eosio::name to, eosio::name author, eosio::asset quantity, std::string memo);
    ACTION dellog(uint64_t id);


  private:
    struct ft_pair
    {
      eosio::name author;
      eosio::asset ft;
    };

    TABLE log {
      uint64_t id;
      eosio::name from;
      eosio::name to;
      std::vector<uint64_t> nfts;
      ft_pair ft;
      uint8_t type;
      std::string fromchain;
      std::string tochain;

      auto primary_key() const { return id; }
    };
    typedef multi_index<name("logs"), log> logs;

    logs _logs = {get_self(),get_self().value};

    TABLE stats {
      stats() {}
      uint64_t log_id{0};
      std::string chain = "WAX";

      EOSLIB_SERIALIZE(stats, (log_id))
    };
    typedef eosio::singleton< "stats"_n, stats> stat;
    stats _stats;


    TABLE sasset {
			uint64_t                id;
			name                    owner;
			name                    author;
			name                    category;
			std::string                  idata; // immutable data
			std::string                  mdata; // mutable data
			std::vector<sasset>     container;
			//std::vector<account>    containerf;

			auto primary_key() const {
				return id;
			}
			uint64_t by_author() const {
				return author.value;
			}

		};
		typedef eosio::multi_index< "sassets"_n, sasset,
			eosio::indexed_by< "author"_n, eosio::const_mem_fun<sasset, uint64_t, &sasset::by_author> >
			> sassets;

    uint64_t getid();
};
