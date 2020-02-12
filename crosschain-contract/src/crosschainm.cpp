#include <crosschainm.hpp>

//memo example:  WAX:tonameexampl
//first verb - to chain name
//second verb - to user name
ACTION crosschainm::transfernft(eosio::name from, eosio::name to , std::vector<uint64_t>& assetids, std::string memo) {
  require_auth(from);

  eosio::check(from != get_self(),"From can't be contract name.");
  if(to != get_self())
  {
    return;
  }

  auto pos = memo.find(":");
  std::string chain_name = memo.substr(0,pos);

  memo.erase(0, pos+1);

  eosio::name user_to = name(memo);

  uint64_t log_id = getid();

  _logs.emplace(get_self(),[&](auto& new_log){
    new_log.id = log_id;
    new_log.from = from;
    new_log.to = user_to;
    new_log.nfts = assetids;
    new_log.type = 0;
    new_log.tochain = chain_name;
  });
}

//memo example:  WAX:tonameexampl
//first verb - to chain name
//second verb - to user name
ACTION crosschainm::transferft(eosio::name from, eosio::name to, eosio::name author, eosio::asset quantity, std::string memo)
{
  require_auth(from);

  eosio::check(from != get_self(),"From can't be contract name.");
  if(to != get_self())
  {
    return;
  }

  auto pos = memo.find(":");
  std::string chain_name = memo.substr(0,pos);

  memo.erase(0, pos+1);

  eosio::name user_to = name(memo);

  uint64_t log_id = getid();

  _logs.emplace(get_self(),[&](auto& new_log){
    new_log.id = log_id;
    new_log.from = from;
    new_log.to = user_to;
    new_log.ft = {author, quantity};
    new_log.type = 1;
    new_log.fromchain = _stats.chain;
    new_log.tochain = chain_name;
  });
}

ACTION crosschainm::dellog(uint64_t id)
{
  require_auth(get_self());

  auto l_itr = _logs.find(id);
  eosio::check(l_itr != _logs.end(),"Log with this id don't exist.");
  _logs.erase(l_itr);
}

uint64_t crosschainm::getid() {

	stat config(_self, _self.value);
	_stats = config.exists() ? config.get() : stats{};
	_stats.log_id++;
	config.set(_stats, _self);

	return _stats.log_id;
}


extern "C"
void apply(uint64_t receiver, uint64_t code, uint64_t action)
{
	if (code == SIMPLEASSETS_CONTRACT.value && action == "transfer"_n.value) {
		eosio::execute_action(eosio::name(receiver), eosio::name(code), &crosschainm::transfernft);
	}
	else if (code == SIMPLEASSETS_CONTRACT.value && action == "transferf"_n.value) {

		eosio::execute_action(eosio::name(receiver), eosio::name(code), &crosschainm::transferft);
	}
	else if (code == receiver) {
    switch (action) {
      EOSIO_DISPATCH_HELPER(crosschainm, (dellog))
    }
  }
}